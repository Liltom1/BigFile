import { shallowRef as z, ref as F, createElementBlock as f, openBlock as g, createElementVNode as v, withKeys as C, withModifiers as x, Fragment as j, renderList as B, createCommentVNode as U, toDisplayString as S, normalizeStyle as K } from "vue";
const O = (i, t) => {
  const r = i.__vccOpts || i;
  for (const [n, o] of t)
    r[n] = o;
  return r;
}, D = ["onKeydown"], E = { key: 0 }, I = {
  key: 1,
  class: "progress progress-striped active"
}, M = ["aria-valuenow"], R = /* @__PURE__ */ Object.assign({
  name: "BigFileUpload"
}, {
  __name: "index",
  props: {
    options: {
      type: Object,
      default: () => ({
        checkFileUrl: "",
        uploadFileUrl: "",
        mergeFileUrl: "",
        chunkSize: 1024 * 1024 * 5
        // 5MB
      })
    }
  },
  setup(i) {
    const t = z(), r = new Worker("../worker.js"), n = [], o = i, a = F([]);
    console.log(o.options);
    const $ = () => {
      _();
    }, _ = () => {
      t.value.value = "", t.value.click();
    }, b = (c) => {
      const s = c.target.files;
      console.log(c, "e");
      const e = s[0];
      console.log(e.name), e.state = "pending", a.value = [...a.value, e];
      const p = Math.ceil(e.size / o.options.chunkSize);
      console.log(p, "total"), n.push(...Array.from({ length: p }, (w, m) => e.slice(m * o.options.chunkSize, (m + 1) * o.options.chunkSize))), console.log(n, "chunks"), r.postMessage({
        chunks: n,
        filename: e.name
      }), console.log(r, "worker");
    }, u = F(0);
    return r.onmessage = async function(c) {
      console.log(c, "e"), t.value.value = "";
      const { filename: s, hash: e } = c.data, p = await fetch(`${o.options.checkFileUrl}?hash=${e}`), { files: w } = await p.json(), m = new Set(w), k = n.map((l, d) => ({ chunk: l, index: d })).filter(({ index: l }) => !m.has(`${s}-${l}`));
      for (const { chunk: l, index: d } of k) {
        const h = new FormData();
        h.append("filename", s), h.append("hash", e), h.append("index", d), h.append("file", l), await fetch(o.options.uploadFileUrl, {
          method: "POST",
          body: h
        }), n.length === k.length ? u.value = ((d + 1) / n.length).toFixed(2) * 100 : u.value = ((d + 1 + (n.length - k.length)) / n.length).toFixed(2) * 100;
      }
      await fetch(`${o.options.mergeFileUrl}?hash=${e}&filename=${s}`), n.length = 0;
      const y = a.value.findIndex((l) => l.name === s);
      y !== -1 && (a.value[y].state = "uploaded"), a.value = [...a.value];
    }, (c, s) => (g(), f("div", null, [
      v("button", {
        onClick: _,
        onKeydown: C(x($, ["self"]), ["enter", "space"])
      }, "开始上传", 40, D),
      v("input", {
        style: { display: "none" },
        ref_key: "inputRef",
        ref: t,
        type: "file",
        id: "file",
        multiple: !0,
        onChange: b,
        onClick: s[0] || (s[0] = x(() => {
        }, ["stop"]))
      }, null, 544),
      (g(!0), f(j, null, B(a.value, (e, p) => (g(), f("li", {
        class: "list-group-item",
        key: p
      }, [
        v("span", null, S(e.name), 1),
        e.state === "pending" ? (g(), f("span", E, "上传进度")) : U("", !0),
        e.state === "pending" ? (g(), f("div", I, [
          v("div", {
            role: "progressbar",
            class: "progress-bar",
            style: K(`width:${u.value}%;`),
            "aria-valuenow": u.value,
            "aria-valuemin": "0",
            "aria-valuemax": "100"
          }, S(u.value) + "%", 13, M)
        ])) : U("", !0)
      ]))), 128))
    ]));
  }
}), N = /* @__PURE__ */ O(R, [["__scopeId", "data-v-06a4eff6"]]), V = [N], A = function(i) {
  V.forEach((t) => {
    i.component(t.name, t);
  });
}, P = { install: A };
export {
  P as default
};
