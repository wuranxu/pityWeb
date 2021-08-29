ace.define("ace/theme/material-one-dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

  exports.isDark = false;
  exports.cssClass = "ace-material-one-dark";
  exports.cssText = `
.ace-material-one-dark .ace_gutter {
  background: #272B33;
  color: rgb(103,111,122)
}

.ace-material-one-dark .ace_print-margin {
  // width: 1px;
  background: #e8e8e8
}

.ace-material-one-dark {
  background-color: #272B33;
  color: #A6B2C0
}

.ace-material-one-dark .ace_cursor {
  color: #528BFF
}

.ace-material-one-dark .ace_marker-layer .ace_selection {
  background: #3D4350
}

.ace-material-one-dark.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px #272B33;
  border-radius: 2px
}

.ace-material-one-dark .ace_marker-layer .ace_step {
  background: rgb(198, 219, 174)
}

.ace-material-one-dark .ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid #747369
}

.ace-material-one-dark .ace_marker-layer .ace_active-line {
  background: #2B313A
}

.ace-material-one-dark .ace_gutter-active-line {
  background-color: #2B313A
}

.ace-material-one-dark .ace_marker-layer .ace_selected-word {
  border: 1px solid #3D4350
}

.ace-material-one-dark .ace_fold {
  background-color: #61AEEF;
  border-color: #A6B2C0
}

.ace-material-one-dark .ace_keyword {
  color: #C679DD
}

.ace-material-one-dark .ace_keyword.ace_operator {
  color: #A6B2C0
}

.ace-material-one-dark .ace_keyword.ace_other.ace_unit {
  color: #D2945D
}

.ace-material-one-dark .ace_constant {
  color: #D2945D
}

.ace-material-one-dark .ace_constant.ace_numeric {
  color: #D2945D
}

.ace-material-one-dark .ace_constant.ace_character.ace_escape {
  color: #57B6C2
}

.ace-material-one-dark .ace_support.ace_function {
  color: #57B6C2
}

.ace-material-one-dark .ace_support.ace_class {
  color: #E5C17C
}

.ace-material-one-dark .ace_storage {
  color: #C679DD
}

.ace-material-one-dark .ace_invalid.ace_illegal {
  color: #272B33;
  background-color: #f2777a
}

.ace-material-one-dark .ace_invalid.ace_deprecated {
  color: #272B33;
  background-color: #d27b53
}

.ace-material-one-dark .ace_string {
  color: #90C378
}

.ace-material-one-dark .ace_string.ace_regexp {
  color: #57B6C2
}

.ace-material-one-dark .ace_comment {
  font-style: italic;
  color: #59626F
}

.ace-material-one-dark .ace_variable {
  color: #DF6A73
}

.ace-material-one-dark .ace_meta.ace_selector {
  color: #C679DD
}

.ace-material-one-dark .ace_entity.ace_other.ace_attribute-name {
  color: #D2945D
}

.ace-material-one-dark .ace_entity.ace_name.ace_function {
  color: #61AEEF
}

.ace-material-one-dark .ace_entity.ace_name.ace_tag {
  color: #DF6A73
}

.ace-material-one-dark .ace_markup.ace_list {
  color: #DF6A73
}
`;

  var dom = require("ace/lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
});                (function() {
  ace.require(["ace/theme/ace-material-one-dark"], function(m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
