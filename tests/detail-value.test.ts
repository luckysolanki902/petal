import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DetailValue } from "../components/detail-value";
test("evidence renders links, GFM tables, task lists, line breaks and safe markdown", () => {
  const html = renderToStaticMarkup(
    React.createElement(DetailValue, {
      value:
        "https://github.com/example/repo/pull/1\nNext line\n\n| Name | State |\n| --- | --- |\n| Task | **Done** |\n\n- [x] Verified\n\n~~old~~\n\n<script>alert(1)</script>\n\n[bad](javascript:alert(1))",
    }),
  );
  assert.match(html, /href="https:\/\/github.com\/example\/repo\/pull\/1"/);
  assert.match(html, /<table>/);
  assert.match(html, /<strong>Done<\/strong>/);
  assert.match(html, /type="checkbox"/);
  assert.match(html, /<del>old<\/del>/);
  assert.match(html, /<br\/>/);
  assert.doesNotMatch(html, /<script>|href="javascript:/);
});
