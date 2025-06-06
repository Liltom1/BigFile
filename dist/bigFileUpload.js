import { createElementBlock as k, openBlock as g, createElementVNode as w, withModifiers as F } from "vue";
const U = /* @__PURE__ */ Object.assign({
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
  setup(h) {
    const s = new Worker("../worker.js"), c = [], e = h;
    console.log(e.options);
    const m = (l) => {
      const n = l.target.files[0], r = Math.ceil(n.size / e.options.chunkSize);
      console.log(r, "total"), c.push(...Array.from({ length: r }, (f, p) => n.slice(p * e.options.chunkSize, (p + 1) * e.options.chunkSize))), console.log(c, "chunks"), s.postMessage({
        chunks: c,
        filename: n.name
      }), console.log(s, "worker");
    };
    return s.onmessage = async function(l) {
      console.log(l, "e");
      const { filename: o, hash: n } = l.data, r = await fetch(`${e.options.checkFileUrl}?hash=${n}`), { files: f } = await r.json(), p = new Set(f), u = c.map((t, i) => ({ chunk: t, index: i })).filter(({ index: t }) => !p.has(`${o}-${t}`)), d = (t) => new Promise((i) => setTimeout(i, t));
      for (const { chunk: t, index: i } of u) {
        const a = new FormData();
        a.append("filename", o), a.append("hash", n), a.append("index", i), a.append("file", t), await fetch(e.options.uploadFileUrl, {
          method: "POST",
          body: a
        }), await d(2e3);
      }
      await fetch(`${e.options.mergeFileUrl}?hash=${n}&filename=${o}`);
    }, (l, o) => (g(), k("div", null, [
      w("input", {
        type: "file",
        id: "file",
        multiple: !0,
        onChange: m,
        onClick: o[0] || (o[0] = F(() => {
        }, ["stop"]))
      }, null, 32)
    ]));
  }
}), $ = [U], x = function(h) {
  $.forEach((s) => {
    h.component(s.name, s);
  });
}, y = { install: x };
export {
  y as default
};
