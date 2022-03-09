import {Viewer} from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight-ssr';
import mediumZoom from '@bytemd/plugin-medium-zoom';
import 'bytemd/dist/index.min.css';
import 'highlight.js/styles/atom-one-dark.css';

const plugins = [gfm(), highlight(), mediumZoom()];

export default ({value, setValue}) => {

  return (
    <Viewer
      value={value}
      plugins={plugins}
      onChange={(v) => {
        setValue(v)
      }}
    />
  )
}
