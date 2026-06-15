(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[91],{2341:function(e,t,r){Promise.resolve().then(r.bind(r,4187))},4187:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return x}});var n=r(7437),a=r(2265),s=r(6463),o=r(8030);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,o.Z)("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);var c=r(4504),u=r(1240),l=r(3852);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let d=(0,o.Z)("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);var h=r(7138);function x(e){let{children:t}=e,r=(0,s.useRouter)(),o=(0,s.usePathname)();(0,a.useEffect)(()=>{localStorage.getItem("adminAuth")||r.push("/admin/login")},[r]);let x=[{icon:i,label:"대시보드",path:"/admin"},{icon:c.Z,label:"응원가 관리",path:"/admin/songs"},{icon:u.Z,label:"선수 관리",path:"/admin/players"}];return"/admin/login"===o?(0,n.jsx)(n.Fragment,{children:t}):(0,n.jsxs)("div",{className:"min-h-screen bg-suwon-bgDark",children:[(0,n.jsx)("nav",{className:"sticky top-0 z-50 bg-gradient-to-r from-suwon-red to-suwon-navy backdrop-blur px-4 py-4 border-b border-suwon-red/30",children:(0,n.jsxs)("div",{className:"max-w-7xl mx-auto flex items-center justify-between",children:[(0,n.jsx)("div",{className:"flex items-center gap-4",children:(0,n.jsx)("h1",{className:"text-h1 text-suwon-textPrimary font-bold",children:"수원FC 어드민"})}),(0,n.jsxs)("div",{className:"flex items-center gap-4",children:[(0,n.jsx)(h.default,{href:"/",children:(0,n.jsx)(l.Z,{size:20,className:"text-suwon-textPrimary cursor-pointer hover:text-suwon-red transition-colors"})}),(0,n.jsxs)("button",{onClick:()=>{localStorage.removeItem("adminAuth"),r.push("/admin/login")},className:"flex items-center gap-2 px-4 py-2 bg-suwon-cardDark rounded-button hover:bg-suwon-red/20 transition-colors",children:[(0,n.jsx)(d,{size:18,className:"text-suwon-textPrimary"}),(0,n.jsx)("span",{className:"text-caption text-suwon-textPrimary",children:"로그아웃"})]})]})]})}),(0,n.jsx)("nav",{className:"bg-suwon-cardDark border-b border-suwon-red/20",children:(0,n.jsx)("div",{className:"max-w-7xl mx-auto px-4",children:(0,n.jsx)("div",{className:"flex gap-1",children:x.map(e=>{let t=o===e.path,r=e.icon;return(0,n.jsxs)(h.default,{href:e.path,className:"flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ".concat(t?"border-suwon-red text-suwon-red bg-suwon-red/10":"border-transparent text-suwon-textSecondary hover:text-suwon-textPrimary hover:bg-suwon-red/5"),children:[(0,n.jsx)(r,{size:18}),(0,n.jsx)("span",{className:"text-body2",children:e.label})]},e.path)})})})}),(0,n.jsx)("main",{className:"max-w-7xl mx-auto p-6",children:t})]})}},8030:function(e,t,r){"use strict";r.d(t,{Z:function(){return c}});var n=r(2265);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),s=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter((e,t,r)=>!!e&&r.indexOf(e)===t).join(" ")};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,n.forwardRef)((e,t)=>{let{color:r="currentColor",size:a=24,strokeWidth:i=2,absoluteStrokeWidth:c,className:u="",children:l,iconNode:d,...h}=e;return(0,n.createElement)("svg",{ref:t,...o,width:a,height:a,stroke:r,strokeWidth:c?24*Number(i)/Number(a):i,className:s("lucide",u),...h},[...d.map(e=>{let[t,r]=e;return(0,n.createElement)(t,r)}),...Array.isArray(l)?l:[l]])}),c=(e,t)=>{let r=(0,n.forwardRef)((r,o)=>{let{className:c,...u}=r;return(0,n.createElement)(i,{ref:o,iconNode:t,className:s("lucide-".concat(a(e)),c),...u})});return r.displayName="".concat(e),r}},3852:function(e,t,r){"use strict";r.d(t,{Z:function(){return n}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=(0,r(8030).Z)("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]])},4504:function(e,t,r){"use strict";r.d(t,{Z:function(){return n}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=(0,r(8030).Z)("Music",[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]])},1240:function(e,t,r){"use strict";r.d(t,{Z:function(){return n}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=(0,r(8030).Z)("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]])},7138:function(e,t,r){"use strict";r.d(t,{default:function(){return a.a}});var n=r(231),a=r.n(n)},6463:function(e,t,r){"use strict";var n=r(1169);r.o(n,"usePathname")&&r.d(t,{usePathname:function(){return n.usePathname}}),r.o(n,"useRouter")&&r.d(t,{useRouter:function(){return n.useRouter}}),r.o(n,"useSearchParams")&&r.d(t,{useSearchParams:function(){return n.useSearchParams}})}},function(e){e.O(0,[231,971,23,744],function(){return e(e.s=2341)}),_N_E=e.O()}]);