import { createElementBlock as v, openBlock as h, createElementVNode as _, normalizeStyle as T, toDisplayString as j, Fragment as z, renderList as L, createBlock as B, createCommentVNode as I, shallowRef as P, withKeys as K, withModifiers as N, ref as U, createVNode as R } from "vue";
const x = (a, s) => {
  const o = a.__vccOpts || a;
  for (const [l, r] of s)
    o[l] = r;
  return o;
}, A = { class: "progress progress-striped active" }, D = ["aria-valuenow"], V = /* @__PURE__ */ Object.assign({
  name: "Progress"
}, {
  __name: "index",
  props: {
    percentage: {
      type: Number,
      default: 0
    }
  },
  setup(a) {
    return (s, o) => (h(), v("div", null, [
      _("div", A, [
        _("div", {
          role: "progressbar",
          class: "progress-bar",
          style: T(`width:${a.percentage}%;`),
          "aria-valuenow": a.percentage,
          "aria-valuemin": "0",
          "aria-valuemax": "100"
        }, j(a.percentage) + "%", 13, D)
      ])
    ]));
  }
}), E = /* @__PURE__ */ x(V, [["__scopeId", "data-v-fc41b854"]]), W = { class: "list-group" }, q = ["tabindex"], G = { class: "list-group-item-info" }, H = { key: 0 }, J = ["onClick"], Q = {
  __name: "upload-list",
  props: {
    uploadFiles: {
      type: Array,
      default: () => []
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  emits: ["removeFile"],
  setup(a, { emit: s }) {
    const o = s;
    function l(r) {
      if (r.state === "pending") {
        alert("文件正在上传中，请稍后再删除");
        return;
      }
      o("removeFile", r);
    }
    return (r, e) => (h(), v("ul", W, [
      (h(!0), v(z, null, L(a.uploadFiles, (c, y) => (h(), v("li", {
        class: "list-group-item",
        key: y,
        tabindex: y
      }, [
        _("div", G, [
          _("span", null, j(c.name), 1),
          c.state === "pending" ? (h(), v("span", H, "上传进度")) : I("", !0),
          _("label", {
            class: "list-group-item-label",
            onClick: (k) => l(c)
          }, "x", 8, J)
        ]),
        c.state === "pending" ? (h(), B(E, {
          key: 0,
          percentage: Number(a.percentage)
        }, null, 8, ["percentage"])) : I("", !0)
      ], 8, q))), 128))
    ]));
  }
}, X = /* @__PURE__ */ x(Q, [["__scopeId", "data-v-40492e41"]]), Y = ["onKeydown"], Z = {
  __name: "upload-content",
  props: {
    onChange: {
      type: Function,
      default: () => {
      }
    }
  },
  setup(a) {
    const s = P(), o = () => {
      l();
    }, l = () => {
      s.value.value = "", s.value.click();
    };
    return (r, e) => (h(), v("div", null, [
      _("button", {
        class: "uploadButton",
        onClick: l,
        onKeydown: K(N(o, ["self"]), ["enter", "space"])
      }, "+ 点击上传", 40, Y),
      _("input", {
        style: { display: "none" },
        ref_key: "inputRef",
        ref: s,
        type: "file",
        id: "file",
        multiple: !0,
        onChange: e[0] || (e[0] = (...c) => a.onChange && a.onChange(...c)),
        onClick: e[1] || (e[1] = N(() => {
        }, ["stop"]))
      }, null, 544)
    ]));
  }
}, ee = /* @__PURE__ */ x(Z, [["__scopeId", "data-v-d97b4021"]]), te = /* @__PURE__ */ Object.assign({
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
        chunkSize: 1024 * 1024 * 5,
        // 5MB
        CONCURRENT_LIMIT: 5
        // 并发上传限制
      })
    },
    onChange: {
      type: Function,
      default: () => {
      }
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },
  setup(a) {
    const s = new Worker("../worker.js"), o = [], l = a;
    let r = null;
    const e = U([]);
    let c = [];
    const y = async (u) => {
      const t = u.target.files;
      if (!t || t.length === 0)
        return;
      console.log(t, "file"), r = t[0];
      for (let p = 0; p < t.length; p++) {
        const i = t[p];
        i.state = "pending", c.push(i);
      }
      e.value = [...e.value, r];
      const g = Math.ceil(r.size / l.options.chunkSize);
      o.push(...Array.from({ length: g }, (p, i) => r.slice(i * l.options.chunkSize, (i + 1) * l.options.chunkSize))), console.log(o, "chunks"), s.postMessage({
        chunks: o,
        filename: r.name
      });
    }, k = U(0);
    s.onmessage = async function(u) {
      const { filename: t, hash: g } = u.data, p = await fetch(`${l.options.checkFileUrl}?hash=${g}`), { files: i, isExist: f } = await p.json();
      let m = e.value.findIndex((n) => n.name === t);
      if (f && i.length === 0 && e.value[m].state === "uploaded") {
        e.value = [...e.value.filter((n) => n.state !== "pending")], alert("文件已上传过，无需重复上传");
        return;
      }
      const d = new Set(i), $ = o.map((n, w) => ({ chunk: n, index: w })).filter(({ index: n }) => !d.has(`${t}-${n}`)), C = l.options.CONCURRENT_LIMIT, F = $.length;
      for (let n = 0; n < F; n += C)
        await Promise.all(
          $.slice(n, n + C).map((w, M) => O(w.chunk, n + M, t, g, F))
        ), console.log(`已上传 ${Math.min(n + C, F)}/${F}`);
      await fetch(`${l.options.mergeFileUrl}?hash=${g}&filename=${t}`), o.length = 0, m = e.value.findIndex((n) => n.name === t), m !== -1 && (e.value[m].state = "uploaded"), e.value = [...e.value], k.value = 0;
      const b = c.filter((n, w) => n.name !== t);
      if (console.log("待上传文件:", b), c = [], b.length > 0) {
        y({
          target: {
            files: b
          }
        });
        return;
      }
      l.onChange(e.value[m], e.value, "add"), console.log("所有分片上传完毕，文件已合并");
    };
    const O = async (u, t, g, p, i) => {
      const f = new FormData();
      return f.append("filename", g), f.append("hash", p), f.append("index", t), f.append("file", u), new Promise((m) => {
        fetch(l.options.uploadFileUrl, {
          method: "POST",
          body: f
        }).then((d) => {
          if (console.log("上传分片:", t, "响应状态:", d.status), d.status === 200)
            return m(d.json());
          throw new Error("网络错误");
        }).then((d) => {
          o.length === i ? k.value = ((t + 1) / o.length).toFixed(2) * 100 : k.value = ((t + 1 + (o.length - i)) / o.length).toFixed(2) * 100;
        }).catch((d) => {
          console.error("上传失败:", d);
        });
      });
    }, S = (u) => {
      e.value = [...e.value.filter((t) => t.name !== u.name)], l.onChange(u, e.value, "remove");
    };
    return (u, t) => (h(), v("div", null, [
      R(ee, { "on-change": y }),
      R(X, {
        uploadFiles: e.value,
        percentage: k.value,
        onRemoveFile: S
      }, null, 8, ["uploadFiles", "percentage"])
    ]));
  }
}), ne = [te, E], oe = function(a) {
  ne.forEach((s) => {
    a.component(s.name, s);
  });
}, le = { install: oe };
export {
  le as default
};
