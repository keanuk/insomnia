import CodeMirror from 'codemirror';
import { Spectral } from '@stoplight/spectral';

const spectral = new Spectral();

CodeMirror.registerHelper('lint', 'openapi', async function(text) {
  const results = await spectral.run(text);
  return results.map(result => ({
    from: CodeMirror.Pos(result.range.start.line, result.range.start.character),
    to: CodeMirror.Pos(result.range.end.line, result.range.end.character),
    message: result.message,
  }));
});
