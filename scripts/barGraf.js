define(["d3.v5", "baseGraf"], function (d3, baseGraf) {
    class barGraf extends baseGraf {
        constructor(opts) {
            super(opts);
            this.id = opts.id || "id-" + Math.floor(Math.random() * 99999),
                this.w = opts.width;
            this.h = opts.height;
            this.data = opts.data || undefined;
            this.url = opts.url || undefined;
            this.margin = opts.margin;
            this.scaleX;
            this.scaleX2;
            this.scaleY;
            this.svg;
            this.categories = opts.categories || [];
            this.attributes = opts.attributes || [];
            this.classes = opts.classes || [];
            this.colors = opts.colors;
            this.group_graf;

            this.attA = 0;
            this.attB = 0;
        }
        
        update() {
            this.updateAxis();
            this.addCircles()
        }
        
    }
    return barGraf;
});