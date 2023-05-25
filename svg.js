const svgNamespace = "http://www.w3.org/2000/svg";

export function makeSVG(parent, width, height) {
    let svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttributeNS(null, 'width', '100%');
    svg.setAttributeNS(null, 'height', '100%');
    parent.appendChild(svg);
    return svg;
}


export function element(name) {
    return new SVGElement(name);
}


class SVGElement {
    constructor(name) {
        this.element = document.createElementNS(svgNamespace, name);
    }

    property(name, value) {
        this.element.setAttributeNS(null, name, value);
        return this;
    }

    numberProperty(name, num) {
        return this.property(name, num.toString());
    }

    id(id) {
        return this.property("id", id);
    }

    width(w) {
        return this.numberProperty("width", w);
    }

    height(h) {
        return this.numberProperty("height", h);
    }

    stroke(width=1, color="black") {
        return this.numberProperty("stroke-width", width)
            .property("stroke", color);
    }

    fill(color) {
        return this.property("fill", color);
    }


    outline(color="black", width=1) {
        return this.stroke(1, "black").fill("none");
    }

    show(svg) {
        svg.appendChild(this.element);
    }
}


class XYElement extends SVGElement {
    topLeft(x, y) {
        return this.x(x).y(y);
    }

    x(x) {
        return this.numberProperty("x", x);
    }

    y(y) {
        return this.numberProperty("y", y);
    }
}


class RectElement extends XYElement {
    constructor() {
        super("rect");
    }

}


export function rect() {
    return new RectElement();
}


class LineElement extends SVGElement {
    constructor() {
        super("line");
    }

    start(x, y) {
        return this.x1(x).y1(y);
    }

    end(x, y) {
        return this.x2(x).y2(y);
    }

    x1(x) {
        return this.numberProperty("x1", x);
    }

    y1(y) {
        return this.numberProperty("y1", y);
    }

    x2(x) {
        return this.numberProperty("x2", x);
    }

    y2(y) {
        return this.numberProperty("y2", y);
    }
}


export function line() {
    return new LineElement();
}


class TextElement extends XYElement {
    constructor() {
        super("text");
    }

    contents(text) {
        let node = document.createTextNode(text);
        this.element.appendChild(node);
        return this;
    }
}


export function text() {
    return new TextElement();
}


class EllipseElement extends SVGElement {
    constructor() {
        super("ellipse");
    }

    cx(x) {
        return this.numberProperty("cx", x);
    }

    cy(y) {
        return this.numberProperty("cy", y);
    }

    rx(x) {
        return this.numberProperty("rx", x);
    }

    ry(y) {
        return this.numberProperty("ry", y);
    }
}

export function ellipse() {
    return new EllipseElement();
}

export function group(...elements) {
    let g = new SVGElement("g");
    elements.forEach(e => e.show(g.element));
    return g;
}

export function startBlinking(blinkable, duration="250ms") {
    let animate = element("animate")
        .property("attributeName", "opacity")
        .property("dur", duration)
        .property("values", "0;1;0")
        .property("repeatCount", "indefinite")
        .property("begin", "0.1");
    animate.show(blinkable);
}


export function stopBlinking(blinking) {
    blinking.querySelectorAll("animate").forEach(a => a.remove());
}
