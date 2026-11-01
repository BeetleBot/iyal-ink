# iyal.ink

Brand website for ActOne and Fount TUI — screenplay tools by iyal.ink

The ActOne overview uses responsive, lossless WebP screenshots in
`actone/assets/screenshots/`, with native 3840 × 2160 PNG masters in
`actone/assets/screenshots-4k/`. Screenshot dialogs open the original PNGs.
The theme showcase preserves the requested swatch order and updates its main
editor card when a swatch is selected. Custom-theme creation and sharing are
described below the swatches.
Feature screenshots follow three responsive writing chapters: worldbuilding,
drafting, and sharing. Close crops and overlapping figures highlight details;
their dialogs still open the complete original screenshot.

Run the screenshot and theme interaction checks with:

```sh
node --test actone/tests/screenshots.test.cjs
```
