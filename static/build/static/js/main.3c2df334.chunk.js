(this.webpackJsonpart_gallery=this.webpackJsonpart_gallery||[]).push([[0],Array(45).concat([function(e,t,a){e.exports=a(82)},,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},,,,,,function(e,t,a){},,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),i=a(24),c=a.n(i),s=(a(50),a(5)),l=a(6),o=a(14),u=a(8),m=a(7),h=(a(51),a(52),a(13)),d=a(96),p=a(4);function v(e){return r.a.createElement("div",{className:"header"},r.a.createElement("div",{className:"header-logo"},r.a.createElement(p.b,{to:"/"},"Artsee")),r.a.createElement(d.a,{onClick:function(){e.onStartSearching()}},r.a.createElement(h.f,{className:"header-search"})))}a(58);var f=a(9),E=a.n(f),g=a(18);a(60),a(61);function b(e){return r.a.createElement("ul",null," ",void 0!==e.data?e.data.slice(0,10).map((function(t,a){return r.a.createElement("li",{key:t[e.idFieldName],className:"LinkList-item"},r.a.createElement(p.b,{to:e.url+t[e.idFieldName],onClick:function(){return e.onLinkClick()}},t[e.valueFieldName]))})):null)}var k="https://rustyag.herokuapp.com/api",y="".concat(k,"/search/"),S="".concat(k,"/artist/"),N="".concat(k,"/paintings/"),C="".concat(k,"/art_movement/"),w=function(e){return"".concat(k,"/artist/").concat(e,"/paintings/")},j="".concat(k,"/popular/"),O="".concat(k,"/transform/"),L=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={results:{}},n}return Object(l.a)(a,[{key:"componentDidUpdate",value:function(e){var t=this;if(this.props.searchPhrase!==e.searchPhrase){if(""===this.props.searchPhrase)return;this.fetchSearchResults(this.props.searchPhrase).then((function(e){null!=e&&t.setState({results:e})}))}}},{key:"fetchSearchResults",value:function(){var e=Object(g.a)(E.a.mark((function e(t){var a;return E.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=fetch("".concat(y).concat(t)),t!==this.props.searchPhrase){e.next=5;break}return e.next=4,a;case 4:return e.abrupt("return",e.sent.json());case 5:return e.abrupt("return",null);case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){return""===this.props.searchPhrase?null:r.a.createElement("div",{className:"SearchResults"},r.a.createElement("div",{className:"SearchResults-list"},r.a.createElement("h2",null,"Artists"),r.a.createElement(b,{onLinkClick:this.props.onLinkClick,data:this.state.results.artists,idFieldName:"url",valueFieldName:"name",url:"/artist/"})),r.a.createElement("div",{className:"SearchResults-list"},r.a.createElement("h2",null,"Paintings"),r.a.createElement(b,{onLinkClick:this.props.onLinkClick,data:this.state.results.artworks,idFieldName:"id",valueFieldName:"name",url:"/paintings/"})),r.a.createElement("div",{className:"SearchResults-list"},r.a.createElement("h2",null,"Styles"),r.a.createElement(b,{onLinkClick:this.props.onLinkClick,data:this.state.results.styles,idFieldName:"url",valueFieldName:"name",url:"/art_movement/"})))}}]),a}(n.Component),A=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={phrase:""},n.handleSearchPhraseChange=n.handleSearchPhraseChange.bind(Object(o.a)(n)),n.handleEscKeyDown=n.handleEscKeyDown.bind(Object(o.a)(n)),n}return Object(l.a)(a,[{key:"handleSearchPhraseChange",value:function(e){this.setState({phrase:e.target.value})}},{key:"handleEscKeyDown",value:function(e){27===e.keyCode&&this.props.onStopSearching()}},{key:"render",value:function(){return r.a.createElement("div",{className:"Searcher",onKeyDown:this.handleEscKeyDown},r.a.createElement("div",{className:"SearcherInsides"},r.a.createElement(d.a,{onClick:this.props.onStopSearching,className:"Searcher-close"},r.a.createElement(h.b,{className:"Searcher-close-icon"})),r.a.createElement("input",{className:"Searcher-searchbar",type:"search",placeholder:"Search",autoFocus:!0,onKeyDown:this.handleEscKeyDown,onChange:this.handleSearchPhraseChange}),r.a.createElement(L,{searchPhrase:this.state.phrase,onLinkClick:this.props.onStopSearching})))}}]),a}(r.a.Component);a(62),a(63);function I(){return r.a.createElement("div",{className:"NoContentMessage"},r.a.createElement("div",{className:"NoContentMessage-dialog"},"Sorry, content not found"),r.a.createElement(h.g,{className:"NoContentMessage-icon"}))}a(64);function x(){return r.a.createElement("div",{className:"CubeSpinner"},r.a.createElement("div",{className:"CubeSpinner-cube1"}),r.a.createElement("div",{className:"CubeSpinner-cube2"}))}var _=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={isLoaded:!1,hasError:!1,data:[]},n}return Object(l.a)(a,[{key:"componentDidMount",value:function(){this.fetchData()}},{key:"componentDidUpdate",value:function(e){this.props.id!==e.id&&(this.props.onEntityChange(!1),this.reset(),this.fetchData())}},{key:"reset",value:function(){this.setState({isLoaded:!1,hasError:!1,data:[]})}},{key:"fetchData",value:function(){var e=Object(g.a)(E.a.mark((function e(){var t,a;return E.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("".concat(this.props.url).concat(this.props.id));case 3:return t=e.sent,e.next=6,t.json();case 6:a=e.sent,this.setState({isLoaded:!0,data:a,hasError:!1}),this.props.onEntityChange(!0),e.next=15;break;case 11:e.prev=11,e.t0=e.catch(0),this.setState({hasError:!0,isLoaded:!0}),this.props.onEntityChange(!0);case 15:case"end":return e.stop()}}),e,this,[[0,11]])})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=r.a.cloneElement(this.props.description,{data:this.state.data}),t=r.a.cloneElement(this.props.image,{data:this.state.data,onLoad:function(){return null}}),a=r.a.createElement("div",{className:"Entity"},e,t),n=r.a.createElement("div",{className:"Entity-nocontent"},r.a.createElement(I,null));return this.state.isLoaded?this.state.hasError?n:a:r.a.createElement(x,null)}}]),a}(n.Component);a(65);function D(e){return r.a.createElement("div",{className:"EntityDescription"},r.a.createElement("div",{className:"EntityDescription-title"},e.title),r.a.createElement("ul",{className:"EntityDescription-properties"},e.children))}a(66);function P(e){return r.a.createElement("li",{key:e.name,className:"Item"},r.a.createElement("div",{className:"Item-name"},e.name),r.a.createElement("div",{className:"Item-value"},e.value))}function M(e){var t=r.a.createElement("ul",null,e.links.map((function(e,t){return r.a.createElement("li",{key:e.name},r.a.createElement(p.b,{to:"/"+e.url},e.name))})));return r.a.createElement(P,{name:e.name,value:t})}function z(e){var t=r.a.createElement("ul",null,e.values.map((function(e,t){return r.a.createElement("li",{key:t},e)})));return r.a.createElement(P,{name:e.name,value:t})}function F(e){var t=e.data;return r.a.createElement(D,{title:t.name},t.birth&&r.a.createElement(P,{name:"Born",value:t.birth}),t.death&&r.a.createElement(P,{name:"Died",value:t.death}),t.nationality&&r.a.createElement(P,{name:"Nationality",value:t.nationality}),t.field&&r.a.createElement(z,{name:"Field",values:t.field}),t.painting_school&&r.a.createElement(P,{name:"Painting school",value:t.painting_school}),t.art_movement&&r.a.createElement(M,{name:"Art movement",links:t.art_movement}),t.influenced_by&&r.a.createElement(M,{name:"Influenced by",links:t.influenced_by}))}a(67);function U(){return r.a.createElement("div",{className:"NoPhotoAvailable"},r.a.createElement(h.a,{className:"NoPhotoAvailable-icon"}),r.a.createElement("div",{className:"NoPhotoAvailable-dialog"},"No image available"))}a(68);var R=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).handleLoading=function(){n.setState({isLoaded:!0,hasError:!1})},n.handleError=function(){n.setState({isLoaded:!0,hasError:!0})},n.state={isLoaded:!1,hasError:!1},n}return Object(l.a)(a,[{key:"render",value:function(){var e=this.state.isLoaded?"img-loaded":"img-loading";return this.state.hasError?r.a.createElement(U,null):r.a.createElement("img",{src:this.props.src,alt:"",className:e+" "+this.props.styleName,onLoad:this.handleLoading,onError:this.handleError})}}]),a}(n.Component);a(69);function K(e){return r.a.createElement("div",{className:"EntityImage"},r.a.createElement(R,{src:e.src,onLoad:e.onLoad,styleName:"EntityImage-image"}))}function B(e){return r.a.createElement("div",null,r.a.createElement(K,{src:e.data.image_url,onLoad:e.onLoad}))}a(70);function W(e){return r.a.createElement(_,{id:e.id,url:S,description:r.a.createElement(F,null),image:r.a.createElement(B,null),onEntityChange:e.onArtistChange})}var G=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={isArtistLoaded:!1},n.handleArtistChange=n.handleArtistChange.bind(Object(o.a)(n)),n}return Object(l.a)(a,[{key:"handleArtistChange",value:function(e){this.setState({isArtistLoaded:e})}},{key:"render",value:function(){var e=this.props.match.params.artistId;return r.a.createElement("div",{className:"Artist"},r.a.createElement(W,{id:e,onArtistChange:this.handleArtistChange}),this.state.isArtistLoaded&&r.a.createElement(p.b,{className:"Artist-artworks",to:"/artist/".concat(e,"/paintings/")},"See artworks"))}}]),a}(n.Component);function J(e){return r.a.createElement(P,{name:e.name,value:r.a.createElement(p.b,{to:e.to},e.value)})}function T(e){var t=e.data;return r.a.createElement(D,{title:t.title},t.artist_name&&t.artist_url&&r.a.createElement(J,{name:"Artist",value:t.artist_name,to:"/artist/"+t.artist_url}),t.completition_year&&r.a.createElement(P,{name:"Year",value:t.completition_year}),t.period&&r.a.createElement(P,{name:"Period",value:t.period}),t.serie&&r.a.createElement(P,{name:"Serie",value:t.serie}),t.location&&r.a.createElement(P,{name:"Location",value:t.location}),t.gallery&&r.a.createElement(P,{name:"Gallery",value:t.gallery}),t.media[0]&&r.a.createElement(z,{name:"Media",values:t.media}),t.size_x&&t.size_y&&r.a.createElement(P,{name:"Size",value:t.size_x+" x "+t.size_y}),t.styles&&r.a.createElement(M,{name:"Styles",links:t.styles}))}a(71);var Y=a(99),V=a(98),$=(a(72),Object(V.a)((function(e){return{button:{fontSize:24}}})));function q(e){var t=$();return r.a.createElement("div",null,r.a.createElement("input",{type:"file",accept:"image/*",id:"contained-button-file",onChange:e.onUpload,className:"UploadButton-input"}),r.a.createElement("label",{htmlFor:"contained-button-file"},r.a.createElement(Y.a,{size:"large",className:t.button,component:"span",startIcon:r.a.createElement(h.c,{size:"40px"})},e.text)))}function H(e){return e.split("-").map((function(e){return e[0].toUpperCase()+e.substr(1)})).join(" ")}var Q=function(e){return new Promise((function(t,a){var n=new FileReader;n.readAsDataURL(e),n.onload=function(){return t(n.result)},n.onerror=function(e){return a(e)}}))};function X(e){function t(e){return new Promise((function(t,a){var n=new Image;n.onload=function(){return t(n)},n.onerror=a,n.src=e}))}function a(){return(a=Object(g.a)(E.a.mark((function a(n){var r,i,c,s;return E.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return r=n.target.files[0],a.next=3,Q(r);case 3:return i=a.sent,a.next=6,t(i);case 6:return c=a.sent,s={artworkId:e.artworkId,file:i,width:c.width,height:c.height},a.next=10,fetch(O,{method:"POST",body:JSON.stringify(s)});case 10:a.sent;case 11:case"end":return a.stop()}}),a)})))).apply(this,arguments)}return r.a.createElement(q,{text:"Transform",onUpload:function(e){return a.apply(this,arguments)}})}a(73);function Z(e){return r.a.createElement("div",{className:"ArtworkEntityImage"},r.a.createElement(K,{src:e.data.image,onLoad:e.onLoad}),r.a.createElement("div",{className:"ArtworkEntityImage-upload"},r.a.createElement(X,{text:"Style transfer",artworkId:e.data.image,className:"ArtworkEntityImage-upload"})))}function ee(e){return r.a.createElement(_,{id:e.id,url:N,description:r.a.createElement(T,null),image:r.a.createElement(Z,{artworkId:e.id}),onEntityChange:e.onArtworkChange})}var te=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={isArtworkLoaded:!1},n.handleArtworkChange=n.handleArtworkChange.bind(Object(o.a)(n)),n}return Object(l.a)(a,[{key:"handleArtworkChange",value:function(e){this.setState({isArtworkLoaded:e})}},{key:"render",value:function(){var e;return e="match"in this.props?this.props.match.params.artworkId:this.props.artworkId,r.a.createElement("div",{className:"Artwork"},r.a.createElement(ee,{id:e,onArtworkChange:this.handleArtworkChange}))}}]),a}(n.Component);a(74),a(75);function ae(e){var t={backgroundImage:"url(".concat(e.data.image,")"),backgroundSize:"cover",height:"100%"};return r.a.createElement("div",{className:"ArtworkCell"},r.a.createElement("div",{className:"ArtworkCell-picture"},r.a.createElement(p.b,{to:"/paintings/"+e.data.contentId},r.a.createElement("div",{style:t}))),r.a.createElement("div",{className:"ArtworkCell-description"},r.a.createElement("div",{className:"ArtworkCell-description-title"},e.data.title),r.a.createElement("div",{className:"ArtworkCell-description-year"},e.data.completitionYear)))}var ne=a(3);a(76);function re(e){return r.a.createElement(p.b,{to:e.to,className:"BlackAndWhiteLink"},e.children)}a(77);var ie=a(40),ce=a.n(ie),se=(a(79),function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={cells:[],hasMore:n.props.cellsData.length>n.props.pageSize,initialLoad:!0},n.handleLoadMore=n.handleLoadMore.bind(Object(o.a)(n)),n}return Object(l.a)(a,[{key:"handleLoadMore",value:function(e){var t=this.props.pageSize*e;console.log("dssad"),!0===this.state.initialLoad&&this.setState({initialLoad:!1}),this.props.cellsData.length>t?this.setState({cells:this.props.cellsData.slice(0,t)}):this.setState({cells:this.props.cellsData.slice(0,this.props.cellsData.length),hasMore:!1})}},{key:"render",value:function(){var e=this.props.cellComponent;return r.a.createElement(ce.a,{pageStart:0,loadMore:this.handleLoadMore,hasMore:this.state.hasMore,initialLoad:this.state.initialLoad,useWindow:!0,threshold:300,className:"GridView"},this.state.cells.map((function(t,a){return r.a.cloneElement(e,{key:a,data:t})})))}}]),a}(n.Component)),le=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={isLoaded:!1,items:[]},n}return Object(l.a)(a,[{key:"componentDidMount",value:function(){var e=Object(g.a)(E.a.mark((function e(){var t;return E.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.fetchItems();case 2:t=e.sent,this.setState({isLoaded:!0,items:t});case 4:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidUpdate",value:function(){var e=Object(g.a)(E.a.mark((function e(t){var a;return E.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.props.url===t.url){e.next=6;break}return this.setState({isLoaded:!1,items:[]}),e.next=4,this.fetchItems();case 4:a=e.sent,this.setState({isLoaded:!0,items:a});case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"fetchItems",value:function(){var e=Object(g.a)(E.a.mark((function e(){var t,a;return E.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(this.props.url));case 2:return t=e.sent,e.next=5,t.json();case 5:return a=e.sent,e.abrupt("return",a);case 7:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"decodeIdToName",value:function(){return this.entityId.split("-").map((function(e){return e[0].toUpperCase()+e.substr(1)})).join(" ")}},{key:"render",value:function(){return r.a.createElement("div",{className:"Grid"},r.a.createElement("h2",{className:"Grid-title"},this.props.titleComponent),this.state.isLoaded?r.a.createElement(se,{cellsData:this.state.items,cellComponent:this.props.cellComponent,pageSize:20}):r.a.createElement(x,null))}}]),a}(n.Component);function oe(){var e=Object(ne.f)().artistId,t=r.a.createElement("div",null,r.a.createElement(re,{to:"/artist/"+e},H(e)),r.a.createElement("span",{style:{fontWeight:"normal"}}," paintings"));return r.a.createElement(le,{url:w(e),titleComponent:t,cellComponent:r.a.createElement(ae,null)})}a(80);function ue(e){var t,a={backgroundImage:"url(".concat(e.data.image,")"),backgroundSize:"cover",height:"100%"};return r.a.createElement("div",{className:"ArtMovementCell"},r.a.createElement("div",{className:"ArtMovementCell-picture"},r.a.createElement(p.b,{to:"/paintings/"+e.data.id},r.a.createElement("div",{style:a}))),r.a.createElement("div",{className:"ArtMovementCell-description"},r.a.createElement("div",{className:"ArtMovementCell-description-title"},e.data.title),r.a.createElement(p.b,{to:"/artist/"+(t=e.data.artist_name,t.toLowerCase().replace(/\s/g,"-")),className:"ArtMovementCell-description-artist"},e.data.artist_name),r.a.createElement("div",{className:"ArtMovementCell-description-year"},e.data.year)))}function me(){var e=Object(ne.f)().artMovementId,t=r.a.createElement("div",null,H(e));return r.a.createElement(le,{url:C+e,titleComponent:t,cellComponent:r.a.createElement(ue,null)})}a(81);var he=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={auto_spin:!0,paintings_iter:0,paintings:null},n}return Object(l.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.fetchPopular().then((function(t){e.setState({paintings:t}),setInterval((function(){e.state.auto_spin&&e.scroll(1,!0)}),7e3)}))}},{key:"fetchPopular",value:function(){var e=Object(g.a)(E.a.mark((function e(){var t;return E.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(j));case 2:return t=e.sent,e.next=5,t;case 5:return e.abrupt("return",e.sent.json());case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"scroll",value:function(e,t){var a=this;this.setState({auto_spin:t,paintings_iter:function(){var t=(a.state.paintings_iter+e)%a.state.paintings.length;return t>=0?t:a.state.paintings.length-1}()})}},{key:"render",value:function(){var e=this;return null==this.state.paintings?null:r.a.createElement("div",{className:"Popular"},r.a.createElement("div",{className:"Popular-buttons"},r.a.createElement(d.a,{className:"Popular-next",onClick:function(){return e.scroll(-1,!1)}},r.a.createElement(h.d,null)),r.a.createElement(d.a,{className:"Popular-next",onClick:function(){return e.scroll(1,!1)}},r.a.createElement(h.e,null))),r.a.createElement(ee,{id:this.state.paintings[this.state.paintings_iter].id,onArtworkChange:function(){return null}}))}}]),a}(n.Component),de=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={isSearching:!1},n.handleStartSearching=n.handleStartSearching.bind(Object(o.a)(n)),n.handleStopSearching=n.handleStopSearching.bind(Object(o.a)(n)),n}return Object(l.a)(a,[{key:"handleStartSearching",value:function(){this.setState({isSearching:!0})}},{key:"handleStopSearching",value:function(){this.setState({isSearching:!1})}},{key:"render",value:function(){return r.a.createElement(p.a,null,r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},r.a.createElement(v,{onStartSearching:this.handleStartSearching})),r.a.createElement("main",{className:"App-main"},r.a.createElement(ne.c,null,r.a.createElement(ne.a,{path:"/artist/:artistId/paintings/",component:oe}),r.a.createElement(ne.a,{path:"/artist/:artistId/",component:G}),r.a.createElement(ne.a,{path:"/paintings/:artworkId/",component:te}),r.a.createElement(ne.a,{path:"/art_movement/:artMovementId/",component:me}),r.a.createElement(ne.a,{path:"/",component:he}))),this.state.isSearching?r.a.createElement("div",{className:"App-searcher"},r.a.createElement(A,{onStopSearching:this.handleStopSearching})):null))}}]),a}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(de,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}]),[[45,1,2]]]);
//# sourceMappingURL=main.3c2df334.chunk.js.map