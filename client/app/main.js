///txb 
import Vue from 'vue';
import App from './App.vue';
import tab from "components/tab/tab";
import aa from "components/aa/aa";
import Tab from 'components/tab/index';
import Dialog from "components/dialog/index";
import Alert from 'components/alert/index';
import wview from 'components/wview';

Vue.component('tab', tab);
console.log(tab)
// Vue.component('vdialog',dialog);
// Vue.prototype.vdialog = dialog;
const install = function (Vue) {
  Vue.component('Dialog', Dialog);
  Vue.component('Alert', Alert);
  Vue.component('aa', aa);
  Vue.component('wview',wview);
}
Vue.use(install)
Vue.prototype.valert = Alert;
Vue.prototype.vdialog = Dialog;
Vue.prototype.vtab= Tab;
new Vue({
  render: h => h(App)
}).$mount('#app');
