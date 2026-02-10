class BrandsItem extends HTMLElement {
  constructor() {
      super();
      this.AllBrandsGet()
      this.list1 = this.querySelector("#list-1");
      this.list1.querySelectorAll(".brand-alphabet").forEach((e => {
          e.addEventListener("click", this.ClickAlphabet.bind(this))
      }))
      this.listAll = this.querySelector("#all-list");
      this.listAll.querySelectorAll(".brand-alphabet").forEach((e => {
          e.addEventListener("click", this.ClickAlphabet.bind(this))
      }))
      this.brandGroup = this.querySelectorAll(".brands-group").forEach((elements => {
          const alphabet = elements.dataset.alphabet;
          null == elements.querySelector(".brand") ? (elements.closest(".brands-group").classList.add("d-none"), this.list1.querySelector(`[data-alphabet="${alphabet}"]`).classList.add("disable")) : (elements.closest(".brands-group").classList.remove("d-none"), elements.closest(".brands-group").classList.add("brands-active"), this.list1.querySelector(`[data-alphabet="${alphabet}"]`).classList.remove("disable"), this.list1.querySelector(`[data-alphabet="${alphabet}"]`).classList.add("enable"))
      }))
  }
  AllBrandsGet() {
    let newParser = new DOMParser;
      let e, t;
      const n = document.querySelector(".brands-wrapper");
      var o = JSON.parse(this.querySelector(".brandsVendor").textContent).map((e => {
          t = `<a href="/collections/vendors?q=${e.title}">${e.title}</a>`;
          return `<li class="brand" data-alphabet="${e.letter}">${t}</li>`
      }));
      newParser.parseFromString(o, "text/html").querySelectorAll("li").forEach((t => {
          const o = t.dataset.alphabet;
          e = "1" == o || "2" == o || "3" == o || "4" == o || "5" == o || "6" == o || "7" == o || "8" == o || "9" == o || "0" == o ? n.querySelector('.brands-group[data-alphabet="#"] ul') : n.querySelector(`.brands-group[data-alphabet="${o}"] ul`), e.append(t)
      }))
  }
  ClickAlphabet(e) {
    e.preventDefault()
    const elements =  e.target;
    this.querySelectorAll(".brand-alphabet").forEach((e => {
        e.classList.remove("active")
    }))
    if(elements.classList.contains('all-brands') == true){
      elements.classList.add('active')
    }
    elements.closest("li,div").classList.add("active");
    var t = elements.dataset.href;
    this.querySelectorAll(".brands-group").forEach((e => {
        e.classList.remove("active")
    })), null != t || null != t ? (this.querySelector(".brands-wrapper").classList.remove("show-all-brands"), this.querySelector(`.brands-wrapper [data-alphabet="${t}"]`).classList.add("active")) : this.querySelector(".brands-wrapper").classList.add("show-all-brands")
  }
}
customElements.define("brands-item", BrandsItem);