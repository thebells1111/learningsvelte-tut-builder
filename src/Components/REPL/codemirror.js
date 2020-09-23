import CodeMirror from 'codemirror';
import './codemirror.css';
import './foldgutter.css';
import './simplescrollbars.css';

import 'codemirror/mode/javascript/javascript.js';
// import 'codemirror/mode/shell/shell.js';
import 'codemirror/mode/handlebars/handlebars.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/addon/edit/continuelist.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/xml-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/search/searchcursor.js';

export default CodeMirror;
