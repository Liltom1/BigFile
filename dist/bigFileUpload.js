import { createElementBlock as m, openBlock as d, createElementVNode as f, normalizeStyle as S, toDisplayString as R, Fragment as M, renderList as T, createBlock as j, createCommentVNode as b, shallowRef as z, withKeys as L, withModifiers as I, ref as N, createVNode as U } from "vue";
const C = (n, s) => {
  const t = n.__vccOpts || n;
  for (const [a, e] of s)
    t[a] = e;
  return t;
}, B = { class: "progress progress-striped active" }, P = ["aria-valuenow"], K = /* @__PURE__ */ Object.assign({
  name: "Progress"
}, {
  __name: "index",
  props: {
    percentage: {
      type: Number,
      default: 0
    }
  },
  setup(n) {
    return (s, t) => (d(), m("div", null, [
      f("div", B, [
        f("div", {
          role: "progressbar",
          class: "progress-bar",
          style: S(`width:${n.percentage}%;`),
          "aria-valuenow": n.percentage,
          "aria-valuemin": "0",
          "aria-valuemax": "100"
        }, R(n.percentage) + "%", 13, P)
      ])
    ]));
  }
}), E = /* @__PURE__ */ C(K, [["__scopeId", "data-v-fc41b854"]]), A = { class: "list-group" }, D = ["tabindex"], V = { class: "list-group-item-info" }, W = { key: 0 }, q = ["onClick"], G = {
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
  setup(n, { emit: s }) {
    const t = s;
    function a(e) {
      if (e.state === "pending") {
        alert("文件正在上传中，请稍后再删除");
        return;
      }
      t("removeFile", e);
    }
    return (e, h) => (d(), m("ul", A, [
      (d(!0), m(M, null, T(n.uploadFiles, (r, y) => (d(), m("li", {
        class: "list-group-item",
        key: y,
        tabindex: y
      }, [
        f("div", V, [
          f("span", null, R(r.name), 1),
          r.state === "pending" ? (d(), m("span", W, "上传进度")) : b("", !0),
          f("label", {
            class: "list-group-item-label",
            onClick: ($) => a(r)
          }, "x", 8, q)
        ]),
        r.state === "pending" ? (d(), j(E, {
          key: 0,
          percentage: Number(n.percentage)
        }, null, 8, ["percentage"])) : b("", !0)
      ], 8, D))), 128))
    ]));
  }
}, H = /* @__PURE__ */ C(G, [["__scopeId", "data-v-a3099391"]]), J = ["onKeydown"], Q = {
  __name: "upload-content",
  props: {
    onChange: {
      type: Function,
      default: () => {
      }
    }
  },
  setup(n) {
    const s = z(), t = () => {
      a();
    }, a = () => {
      s.value.value = "", s.value.click();
    };
    return (e, h) => (d(), m("div", null, [
      f("button", {
        class: "uploadButton",
        onClick: a,
        onKeydown: L(I(t, ["self"]), ["enter", "space"])
      }, "+ 点击上传", 40, J),
      f("input", {
        style: { display: "none" },
        ref_key: "inputRef",
        ref: s,
        type: "file",
        id: "file",
        multiple: !0,
        onChange: h[0] || (h[0] = (...r) => n.onChange && n.onChange(...r)),
        onClick: h[1] || (h[1] = I(() => {
        }, ["stop"]))
      }, null, 544)
    ]));
  }
}, X = /* @__PURE__ */ C(Q, [["__scopeId", "data-v-cc48dd66"]]), Y = /* @__PURE__ */ Object.assign({
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
  setup(n) {
    const s = new Worker("../worker.js"), t = [], a = n, e = N([]), h = async (c) => {
      const i = c.target.files[0];
      i.state = "pending", e.value = [...e.value, i];
      const _ = Math.ceil(i.size / a.options.chunkSize);
      t.push(...Array.from({ length: _ }, (v, u) => i.slice(u * a.options.chunkSize, (u + 1) * a.options.chunkSize))), console.log(t, "chunks"), s.postMessage({
        chunks: t,
        filename: i.name
      }), console.log(s, "worker");
    }, r = N(0);
    s.onmessage = async function(c) {
      const { filename: l, hash: i } = c.data, _ = await fetch(`${a.options.checkFileUrl}?hash=${i}`), { files: v, isExist: u } = await _.json();
      let g = e.value.findIndex((o) => o.name === l);
      if (u && v.length === 0 && e.value[g].state === "uploaded") {
        e.value = [...e.value.filter((o) => o.state !== "pending")], alert("文件已上传过，无需重复上传");
        return;
      }
      const p = new Set(v), x = t.map((o, w) => ({ chunk: o, index: w })).filter(({ index: o }) => !p.has(`${l}-${o}`)), F = a.options.CONCURRENT_LIMIT, k = x.length;
      for (let o = 0; o < k; o += F)
        await Promise.all(
          x.slice(o, o + F).map((w, O) => y(w.chunk, o + O, l, i, k))
        ), console.log(`已上传 ${Math.min(o + F, k)}/${k}`);
      await fetch(`${a.options.mergeFileUrl}?hash=${i}&filename=${l}`), t.length = 0, g = e.value.findIndex((o) => o.name === l), g !== -1 && (e.value[g].state = "uploaded"), e.value = [...e.value], r.value = 0, a.onChange(e.value[g], e.value, "add"), console.log("所有分片上传完毕，文件已合并");
    };
    const y = async (c, l, i, _, v) => {
      const u = new FormData();
      return u.append("filename", i), u.append("hash", _), u.append("index", l), u.append("file", c), new Promise((g) => {
        fetch(a.options.uploadFileUrl, {
          method: "POST",
          body: u
        }).then((p) => {
          if (console.log("上传分片:", l, "响应状态:", p.status), p.status === 200)
            return g(p.json());
          throw new Error("网络错误");
        }).then((p) => {
          t.length === v ? r.value = ((l + 1) / t.length).toFixed(2) * 100 : r.value = ((l + 1 + (t.length - v)) / t.length).toFixed(2) * 100;
        }).catch((p) => {
          console.error("上传失败:", p);
        });
      });
    }, $ = (c) => {
      console.log(c, "file"), e.value = [...e.value.filter((l) => l.name !== c.name)], a.onChange(c, e.value, "remove");
    };
    return (c, l) => (d(), m("div", null, [
      U(X, { "on-change": h }),
      U(H, {
        uploadFiles: e.value,
        percentage: r.value,
        onRemoveFile: $
      }, null, 8, ["uploadFiles", "percentage"])
    ]));
  }
}), Z = [Y, E], ee = function(n) {
  Z.forEach((s) => {
    n.component(s.name, s);
  });
}, ne = { install: ee };
export {
  ne as default
};
