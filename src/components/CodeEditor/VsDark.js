ace.define("ace/theme/vs-dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

  exports.isDark = false;
  exports.cssClass = "ace-vs-dark";
  exports.cssText = `
.ace-vs-dark .ace_gutter {
  background: #1E1E1E;
  color: rgb(125,125,125)
}

.ace-vs-dark .ace_print-margin {
  background: #e8e8e8
}

.ace-vs-dark {
  background-color: #1E1E1E;
  color: #DCDCDC
}

.ace-vs-dark .ace_cursor {
  color: #DCDCDC
}

.ace-vs-dark .ace_marker-layer .ace_selection {
  background: #264F78
}

.ace-vs-dark.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px #1E1E1E;
  border-radius: 2px
}

.ace-vs-dark .ace_marker-layer .ace_step {
  background: rgb(198, 219, 174)
}

.ace-vs-dark .ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid rgba(255, 255, 255, 0.25)
}

.ace-vs-dark .ace_marker-layer .ace_active-line {
  background: #0F0F0F
}

.ace-vs-dark .ace_gutter-active-line {
  background-color: #0F0F0F
}

.ace-vs-dark .ace_marker-layer .ace_selected-word {
  border: 1px solid #264F78
}

.ace-vs-dark .ace_fold {
  background-color: #DCDCDC;
  border-color: #DCDCDC
}

.ace-vs-dark .ace_keyword {
  color: #569CD6
}

.ace-vs-dark .ace_constant {
  color: #B4CEA8
}

.ace-vs-dark .ace_constant.ace_language {
  color: #569CD6
}

.ace-vs-dark .ace_constant.ace_numeric {
  color: #B5CEA8
}

.ace-vs-dark .ace_constant.ace_character.ace_escape {
  color: #E3BBAB
}

.ace-vs-dark .ace_support.ace_function {
  color: #DCDCDC
}

.ace-vs-dark .ace_support.ace_constant {
  color: #B5CEA8
}

.ace-vs-dark .ace_support.ace_class {
  color: #DCDCDC
}

.ace-vs-dark .ace_support.ace_type {
  color: #DCDCDC
}

.ace-vs-dark .ace_storage.ace_type {
  color: #569CD6
}

.ace-vs-dark .ace_invalid {
  color: #ff3333
}

.ace-vs-dark .ace_string {
  color: #D69D85
}

.ace-vs-dark .ace_comment {
  color: #608B4E
}

.ace-vs-dark .ace_variable {
  color: #DCDCDC
}

.ace-vs-dark .ace_meta.ace_tag {
  color: #808080
}

.ace-vs-dark .ace_entity.ace_other.ace_attribute-name {
  color: #92CAF4
}

.ace-vs-dark .ace_entity.ace_name.ace_function {
  color: #DCDCDC
}

.ace-vs-dark .ace_entity.ace_name.ace_tag {
  color: #569CD6
}

.ace-vs-dark .ace_markup.ace_heading {
  color: #569CD6
}

.ace-vs-dark .ace_markup.ace_list {
  color: #DCDCDC
}
`;

  var dom = require("ace/lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
});                (function() {
  ace.require(["ace/theme/ace-vs-dark"], function(m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
