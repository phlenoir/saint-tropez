const fs = require("fs");
const path = require("path");
const PptxGenJS = require("pptxgenjs");

const rootDir = __dirname;
const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, "manifest.json"), "utf8"));
const template = JSON.parse(fs.readFileSync(path.join(rootDir, "template-data.json"), "utf8"));
const demo = JSON.parse(fs.readFileSync(path.join(rootDir, manifest.demo_content), "utf8"));
const layoutSpec = JSON.parse(fs.readFileSync(path.join(rootDir, manifest.layout_spec), "utf8"));

const outRel = process.argv[2] || manifest.output_file;
const outPath = path.resolve(rootDir, outRel);
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const pptx = new PptxGenJS();
pptx.layout = template.layout;
pptx.author = "OpenAI Codex";
pptx.subject = template.use_case;
pptx.title = demo.meta.title;
pptx.lang = "fr-FR";
pptx.theme = {
  headFontFace: template.fonts.title,
  bodyFontFace: template.fonts.body,
  lang: "fr-FR"
};

const C = {
  ink: template.palette.ink,
  sidebar: template.palette.sidebar_neutral,
  pink: template.palette.section_pink,
  green: template.palette.section_green,
  yellow: template.palette.section_yellow,
  paper: template.palette.paper,
  muted: template.palette.muted_text
};

function color(name) {
  const map = {
    ink: C.ink,
    sidebar_neutral: C.sidebar,
    section_pink: C.pink,
    section_green: C.green,
    section_yellow: C.yellow,
    paper: C.paper,
    muted_text: C.muted
  };
  return map[name] || name;
}

function addPageNumber(slide, pageNum) {
  const cfg = layoutSpec.tokens.footer_page;
  slide.addText(String(pageNum), {
    x: cfg.x,
    y: cfg.y,
    w: cfg.w,
    h: cfg.h,
    fontFace: template.fonts.body,
    fontSize: cfg.fontSize,
    color: C.ink,
    align: "right",
    margin: 0
  });
}

function addSidebar(slide, fillName) {
  const cfg = layoutSpec.tokens.sidebar;
  slide.addShape(pptx.ShapeType.rect, {
    x: cfg.x,
    y: cfg.y,
    w: cfg.w,
    h: cfg.h,
    fill: { color: color(fillName) },
    line: { color: color(fillName) }
  });
}

function addBeveledPanel(slide, cfg, fillName, bevelSize) {
  slide.addShape(pptx.ShapeType.rect, {
    x: cfg.x,
    y: cfg.y,
    w: cfg.w,
    h: cfg.h,
    fill: { color: color(fillName) },
    line: { color: color(fillName) }
  });
}

function addSimpleText(slide, cfg, text, opts = {}) {
  slide.addText(text, {
    x: cfg.x,
    y: cfg.y,
    w: cfg.w,
    h: cfg.h,
    fontFace: opts.fontFace || template.fonts.body,
    fontSize: opts.fontSize || cfg.fontSize || 12,
    color: opts.color || C.ink,
    bold: opts.bold || false,
    italic: opts.italic || false,
    margin: 0,
    align: opts.align || cfg.align,
    valign: opts.valign || "top",
    fit: "shrink",
    breakLine: false
  });
}

function addBulletList(slide, cfg, items) {
  const runs = [];
  items.forEach((item, idx) => {
    runs.push({
      text: item,
      options: {
        bullet: { indent: 12 },
        breakLine: idx !== items.length - 1,
        paraSpaceAfterPt: 5
      }
    });
  });
  slide.addText(runs, {
    x: cfg.x,
    y: cfg.y,
    w: cfg.w,
    h: cfg.h,
    fontFace: template.fonts.body,
    fontSize: cfg.fontSize || 10.5,
    color: C.ink,
    margin: 0,
    valign: "top",
    fit: "shrink"
  });
}

function addUnderline(slide, x, y, titleH) {
  const cfg = layoutSpec.tokens.underline;
  slide.addShape(pptx.ShapeType.line, {
    x,
    y: y + titleH + cfg.gapY,
    w: cfg.w,
    h: cfg.h,
    line: { color: C.green, width: cfg.width }
  });
}

function addColumnBlock(slide, colCfg, title, items) {
  addSimpleText(slide, {
    x: colCfg.titleX,
    y: colCfg.titleY,
    w: colCfg.titleW,
    h: colCfg.titleH,
    fontSize: 14
  }, title, { fontFace: template.fonts.title, bold: true });
  addUnderline(slide, colCfg.titleX, colCfg.titleY, colCfg.titleH);
  addBulletList(slide, {
    x: colCfg.bodyX,
    y: colCfg.bodyY,
    w: colCfg.bodyW,
    h: colCfg.bodyH,
    fontSize: 10.5
  }, items);
}

function renderTitleCover(pageNum) {
  const cfg = layoutSpec.layouts["Title Cover"];
  const slide = pptx.addSlide();
  slide.background = { color: color(cfg.background) };
  addSimpleText(slide, cfg.elements.title, demo.meta.title, {
    fontFace: template.fonts.title,
    fontSize: cfg.elements.title.fontSize,
    color: C.ink,
    bold: true,
    align: "center"
  });
  addSimpleText(slide, cfg.elements.subtitle, demo.meta.subtitle, {
    fontFace: template.fonts.body,
    fontSize: cfg.elements.subtitle.fontSize,
    color: C.ink,
    align: "center"
  });
  addSimpleText(slide, cfg.elements.date, demo.meta.date, {
    fontFace: template.fonts.body,
    fontSize: cfg.elements.date.fontSize,
    color: "000000"
  });
  addPageNumber(slide, pageNum);
}

function renderAgenda(pageNum) {
  const cfg = layoutSpec.layouts["Agenda Vertical"];
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSidebar(slide, cfg.sidebar_fill);
  addSimpleText(slide, cfg.elements.sidebar_title, demo.agenda_title, {
    fontFace: template.fonts.title,
    fontSize: cfg.elements.sidebar_title.fontSize,
    color: C.ink,
    bold: true
  });
  demo.agenda.forEach((item, idx) => {
    addSimpleText(slide, {
      x: cfg.elements.agenda_items.x,
      y: cfg.elements.agenda_items.y + idx * cfg.elements.agenda_items.stepY,
      w: cfg.elements.agenda_items.w,
      h: 0.28,
      fontSize: cfg.elements.agenda_items.fontSize
    }, `${idx + 1}. ${item}`, {
      fontFace: template.fonts.body,
      fontSize: cfg.elements.agenda_items.fontSize,
      color: C.ink
    });
  });
  addPageNumber(slide, pageNum);
}

function renderDivider(pageNum) {
  const cfg = layoutSpec.layouts["Divider Sidebar"];
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSidebar(slide, cfg.sidebar_fill);
  addSimpleText(slide, cfg.elements.sidebar_title, demo.divider.sidebar_title, {
    fontFace: template.fonts.title,
    fontSize: cfg.elements.sidebar_title.fontSize,
    color: C.ink,
    bold: true
  });
  addSimpleText(slide, cfg.elements.title, demo.divider.title, {
    fontFace: template.fonts.title,
    fontSize: cfg.elements.title.fontSize,
    color: C.ink,
    bold: true
  });
  addUnderline(slide, cfg.elements.title.x, cfg.elements.title.y, cfg.elements.title.h);
  addSimpleText(slide, cfg.elements.subtitle, demo.divider.subtitle, {
    fontFace: template.fonts.body,
    fontSize: cfg.elements.subtitle.fontSize,
    color: C.muted
  });
  addPageNumber(slide, pageNum);
}

function renderThreeColumn(pageNum) {
  const cfg = layoutSpec.layouts["Three-Column Synthesis"];
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSidebar(slide, cfg.sidebar_fill);
  addSimpleText(slide, cfg.elements.sidebar_title, demo.three_column.sidebar_title, {
    fontFace: template.fonts.title,
    fontSize: cfg.elements.sidebar_title.fontSize,
    color: C.ink,
    bold: true
  });
  demo.three_column.columns.forEach((col, idx) => {
    addColumnBlock(slide, cfg.elements.columns[idx], col.title, col.items);
  });
  addPageNumber(slide, pageNum);
}

function renderFindings(pageNum) {
  const cfg = layoutSpec.layouts["Findings And Impacts"];
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSidebar(slide, cfg.sidebar_fill);
  addSimpleText(slide, cfg.elements.sidebar_title, demo.findings_impacts.sidebar_title, {
    fontFace: template.fonts.title,
    fontSize: cfg.elements.sidebar_title.fontSize,
    color: C.ink,
    bold: true
  });
  addBulletList(slide, cfg.elements.left_text, demo.findings_impacts.left_text);
  addSimpleText(slide, cfg.elements.middle_title, demo.findings_impacts.middle_title, {
    fontFace: template.fonts.title,
    fontSize: cfg.elements.middle_title.fontSize,
    color: C.ink,
    bold: true
  });
  addUnderline(slide, cfg.elements.middle_title.x, cfg.elements.middle_title.y, cfg.elements.middle_title.h);
  addBulletList(slide, cfg.elements.middle_body, demo.findings_impacts.middle_items);
  addBeveledPanel(slide, cfg.elements.impact_box, cfg.impact_fill, cfg.elements.impact_box.bevel_size);
  addSimpleText(slide, cfg.elements.impact_title, demo.findings_impacts.impact_title, {
    fontFace: template.fonts.title,
    fontSize: cfg.elements.impact_title.fontSize,
    color: C.ink,
    bold: true
  });
  addSimpleText(slide, cfg.elements.impact_body, demo.findings_impacts.impact_items.join("\n\n"), {
    fontFace: template.fonts.body,
    fontSize: cfg.elements.impact_body.fontSize,
    color: C.ink
  });
  addPageNumber(slide, pageNum);
}

function renderScope(pageNum) {
  const cfg = layoutSpec.layouts["Scope Approach Stakeholders"];
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSidebar(slide, cfg.sidebar_fill);
  addSimpleText(slide, cfg.elements.sidebar_title, demo.scope_approach_stakeholders.sidebar_title, {
    fontFace: template.fonts.title,
    fontSize: cfg.elements.sidebar_title.fontSize,
    color: C.ink,
    bold: true
  });
  addSimpleText(slide, cfg.elements.sidebar_body, demo.scope_approach_stakeholders.sidebar_body, {
    fontFace: template.fonts.body,
    fontSize: cfg.elements.sidebar_body.fontSize,
    color: C.ink
  });
  addColumnBlock(slide, cfg.elements.columns[0], demo.scope_approach_stakeholders.scope_title, demo.scope_approach_stakeholders.scope);
  addColumnBlock(slide, cfg.elements.columns[1], demo.scope_approach_stakeholders.approach_title, demo.scope_approach_stakeholders.approach);
  addColumnBlock(slide, cfg.elements.columns[2], demo.scope_approach_stakeholders.stakeholders_title, demo.scope_approach_stakeholders.stakeholders);
  addPageNumber(slide, pageNum);
}

function renderHorizons(pageNum) {
  const cfg = layoutSpec.layouts["Improvement Horizons"];
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSidebar(slide, cfg.sidebar_fill);
  addSimpleText(slide, cfg.elements.sidebar_title, demo.horizons.sidebar_title, {
    fontFace: template.fonts.title,
    fontSize: cfg.elements.sidebar_title.fontSize,
    color: C.ink,
    bold: true
  });
  addSimpleText(slide, cfg.elements.sidebar_body, demo.horizons.sidebar_body, {
    fontFace: template.fonts.body,
    fontSize: cfg.elements.sidebar_body.fontSize,
    color: C.ink
  });
  addColumnBlock(slide, cfg.elements.columns[0], demo.horizons.short_term_title, demo.horizons.short_term);
  addColumnBlock(slide, cfg.elements.columns[1], demo.horizons.mid_term_title, demo.horizons.mid_term);
  addColumnBlock(slide, cfg.elements.columns[2], demo.horizons.long_term_title, demo.horizons.long_term);
  addPageNumber(slide, pageNum);
}

function renderConclusion(pageNum) {
  const cfg = layoutSpec.layouts["Conclusion Key Messages"];
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  addSidebar(slide, cfg.sidebar_fill);
  addSimpleText(slide, cfg.elements.sidebar_title, demo.conclusion.sidebar_title, {
    fontFace: template.fonts.title,
    fontSize: cfg.elements.sidebar_title.fontSize,
    color: C.ink,
    bold: true
  });
  demo.conclusion.messages.forEach((msg, idx) => {
    addSimpleText(slide, {
      x: cfg.elements.messages.x,
      y: cfg.elements.messages.y + idx * cfg.elements.messages.stepY,
      w: cfg.elements.messages.w,
      h: 0.42,
      fontSize: cfg.elements.messages.fontSize
    }, msg, {
      fontFace: template.fonts.body,
      fontSize: cfg.elements.messages.fontSize,
      color: idx === 0 ? "000000" : C.ink,
      bold: idx === 0
    });
  });
  addPageNumber(slide, pageNum);
}

renderTitleCover(1);
renderAgenda(2);
renderDivider(3);
renderThreeColumn(4);
renderFindings(5);
renderScope(6);
renderHorizons(7);
renderConclusion(8);

pptx.writeFile({ fileName: outPath }).then(() => {
  console.log(`Generated ${outPath}`);
}).catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
