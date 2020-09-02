use tch::{nn,Kind,Tensor};

#[derive(Debug)]
pub struct Encoder {
    conv1: nn::Conv2D,
    conv2: nn::Conv2D,
    conv3: nn::Conv2D,
    conv4: nn::Conv2D,
    conv5: nn::Conv2D,
    conv6: nn::Conv2D
}

impl Encoder {
    pub fn new(vs: &nn::Path) -> Encoder {
        let conv1 = nn::conv2d(vs, 3, 3, 1, Default::default());
        let conv2 = nn::conv2d(vs, 3, 64, 3, Default::default());
        let conv3 = nn::conv2d(vs, 64, 64, 3, Default::default());
        let conv4 = nn::conv2d(vs, 64, 128, 3, Default::default());
        let conv5 = nn::conv2d(vs, 128, 128, 3, Default::default());
        let conv6 = nn::conv2d(vs, 128, 256, 3, Default::default());
        Encoder{conv1,conv2,conv3,conv4,conv5,conv6}
    }
}

impl nn::ModuleT for Encoder {
    fn forward_t(&self, xs: &Tensor, _train: bool) -> Tensor {
        xs.apply(&self.conv1)
          .reflection_pad2d(&[1,1,1,1])
          .apply(&self.conv2)
          .relu()
          .reflection_pad2d(&[1,1,1,1])
          .apply(&self.conv3)
          .relu()
          .max_pool2d_default(2)
          .reflection_pad2d(&[1,1,1,1])
          .apply(&self.conv4)
          .relu()
          .reflection_pad2d(&[1,1,1,1])
          .apply(&self.conv5)
          .relu()
          .max_pool2d_default(2)
          .reflection_pad2d(&[1,1,1,1])
          .apply(&self.conv6)
          .relu()
    }
}

#[derive(Debug)]
pub struct Decoder {
    conv7: nn::Conv2D,
    conv8: nn::Conv2D,
    conv9: nn::Conv2D,
    conv10: nn::Conv2D,
    conv11: nn::Conv2D,
}

impl Decoder {
    pub fn new(vs: &nn::Path) -> Decoder {
        let conv7 = nn::conv2d(vs, 256, 128, 3, Default::default());
        let conv8 = nn::conv2d(vs, 128, 128, 3, Default::default());
        let conv9 = nn::conv2d(vs, 128, 64, 3, Default::default());
        let conv10 = nn::conv2d(vs, 64, 64, 3, Default::default());
        let conv11 = nn::conv2d(vs, 64, 3, 3, Default::default());
        Decoder {
            conv7,
            conv8,
            conv9,
            conv10,
            conv11,
        }
    }
}

impl nn::ModuleT for Decoder {
    fn forward_t(&self, xs: &Tensor, _train: bool) -> Tensor {
        let xs = xs.reflection_pad2d(&[1,1,1,1])
                   .apply(&self.conv7)
                   .relu();
        let (_n, _c, h, w) = xs.size4().unwrap();
        let xs = xs.upsample_nearest2d(&[2*h, 2*w], 2.0, 2.0)
                   .reflection_pad2d(&[1,1,1,1])
                   .apply(&self.conv8)
                   .relu()
                   .reflection_pad2d(&[1,1,1,1])
                   .apply(&self.conv9)
                   .relu();
        let (_n, _c, h, w) = xs.size4().unwrap();
        xs.upsample_nearest2d(&[2*h, 2*w], 2.0, 2.0)
          .reflection_pad2d(&[1,1,1,1])
          .apply(&self.conv10)
          .relu()
          .reflection_pad2d(&[1,1,1,1])
          .apply(&self.conv11)
    }
}

#[derive(Debug)]
struct CNN {
    conv1: nn::Conv2D,
    conv2: nn::Conv2D,
    conv3: nn::Conv2D,
    fc: nn::Linear,
}

impl CNN {
    pub fn new(vs: &nn::Path) -> CNN {
        let conv1 = nn::conv2d(vs, 256, 128, 3, Default::default());
        let conv2 = nn::conv2d(vs, 128, 64, 3, Default::default());
        let conv3 = nn::conv2d(vs, 64, 32, 3, Default::default());
        let fc = nn::linear(vs, 32*32, 32*32, Default::default());
        CNN {conv1, conv2, conv3, fc,}
    }
}

impl nn::ModuleT for CNN {
    fn forward_t(&self, xs: &Tensor, _train: bool) -> Tensor {
        let xs = xs.apply(&self.conv1)
                   .relu()
                   .apply(&self.conv2)
                   .relu()
                   .apply(&self.conv3)
                   .view([1,32,-1]);
        let (_n, _c, hw) = xs.size3().unwrap();
        xs.bmm(&xs.transpose(1,2))
          .f_div1(hw)
          .unwrap()
          .view([1,-1])
          .apply(&self.fc)
    }
}


#[derive(Debug)]
pub struct MulLayer {
    cnet: CNN,
    snet: CNN,
    compress: nn::Conv2D,
    unzip: nn::Conv2D,
}

impl MulLayer {
    pub fn new(vs: &nn::Path) -> MulLayer {
        let cnet = CNN::new(&vs);
        let snet = CNN::new(&vs);
        let compress = nn::conv2d(vs, 256, 32, 1, Default::default());
        let unzip = nn::conv2d(vs, 32, 256, 1, Default::default());
        MulLayer {cnet, snet, compress, unzip}
    }
}

impl nn::ModuleT for MulLayer {
    fn forward_t(&self, cf_sf: &Tensor, _train: bool) -> Tensor {
        let cf = cf_sf.get(0);
        let sf = cf_sf.get(1);

        // cF
        let (cb, cc, _ch, _cw) = cf.size4().unwrap();
        let cff = cf.view([cb,cc,-1]);
        let cmean = cff.mean1(&[2],true,Kind::Float)
                       .unsqueeze(3)
                       .expand_as(&cf);
        let cf = cf - cmean;

        // sF
        let (sb, sc, _sh, _sw) = sf.size4().unwrap();
        let sff = sf.view([sb,sc,-1]);
        let smean = sff.mean1(&[2],true,Kind::Float)
                       .unsqueeze(3);
        let smean_c = smean.expand_as(&cf);
        let smean_s = smean.expand_as(&sf);
        let sf = sf - smean_s;

        let compress_content = cf.apply(&self.compress);
        let (b, c, h, w) = compress_content.size4().unwrap();
        let compress_content = compress_content.view([b,c,-1]);

        let c_matrix = self.cnet.forward_t(&cf,false)
                                .view([1,32,32]);
        let s_matrix = self.snet.forward_t(&sf,false)
                                .view([1,32,32]);
        let out = s_matrix.bmm(&c_matrix)
                          .bmm(&compress_content)
                          .view([b,c,h,w])
                          .apply(&self.unzip);
        out + smean_c
    }
}

