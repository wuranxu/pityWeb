ace.define("ace/theme/atom-one-dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

  exports.isDark = false;
  exports.cssClass = "ace-atom-dark";
  exports.cssText = `
.ace-atom-dark .ace_gutter {
  background: #1d1f20;
  color: rgb(139,140,137)
}

.ace-atom-dark .ace_print-margin {
  background: #e8e8e8
}

.ace-atom-dark {
  background-color: #1d1f20;
  color: #F8F8F2
}

.ace-atom-dark .ace_cursor {
  color: #F8F8F0
}

.ace-atom-dark .ace_marker-layer .ace_selection {
  background: #49483E
}

.ace-atom-dark.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px #1d1f20;
  border-radius: 2px
}

.ace-atom-dark .ace_marker-layer .ace_step {
  background: rgb(198, 219, 174)
}

.ace-atom-dark .ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid #49483E
}

.ace-atom-dark .ace_marker-layer .ace_active-line {
  background: #49483E
}

.ace-atom-dark .ace_gutter-active-line {
  background-color: #49483E
}

.ace-atom-dark .ace_marker-layer .ace_selected-word {
  border: 1px solid #49483E
}

.ace-atom-dark .ace_fold {
  background-color: #ffd2a7;
  border-color: #F8F8F2
}

.ace-atom-dark .ace_keyword {
  color: #8ecbfe
}

.ace-atom-dark .ace_constant.ace_language {
  color: #AE81FF
}

.ace-atom-dark .ace_constant.ace_numeric {
  color: #ff73fd
}

.ace-atom-dark .ace_constant.ace_character {
  color: #90cc99
}

.ace-atom-dark .ace_constant.ace_other {
  color: #90cc99
}

.ace-atom-dark .ace_support.ace_function {
  color: #66D9EF
}

.ace-atom-dark .ace_support.ace_constant {
  color: #66D9EF
}

.ace-atom-dark .ace_support.ace_class {
  color: #f7ffb6
}

.ace-atom-dark .ace_support.ace_type {
  color: #f7ffb6
}

.ace-atom-dark .ace_storage {
  color: #F92672
}

.ace-atom-dark .ace_storage.ace_type {
  font-style: italic;
  color: #66D9EF
}

.ace-atom-dark .ace_string {
  color: #9fff60
}

.ace-atom-dark .ace_comment {
  color: #737c7c
}

.ace-atom-dark .ace_variable {
  color: #c8c5ff
}

.ace-atom-dark .ace_variable.ace_parameter {
  font-style: italic;
  color: #c0c5fe
}

.ace-atom-dark .ace_entity.ace_other.ace_attribute-name {
  color: #A6E22E
}

.ace-atom-dark .ace_entity.ace_name.ace_function {
  color: #ffd2a7
}

.ace-atom-dark .ace_entity.ace_name.ace_tag {
  color: #F92672
}
`;

  var dom = require("ace/lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
});                (function() {
  ace.require(["ace/theme/ace-atom-one-dark"], function(m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
