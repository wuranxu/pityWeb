import {Viewer} from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'

const plugins = [
  gfm(),
  // Add more plugins here
]

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
