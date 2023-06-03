import { useState } from "react"
import { Pipette } from "lucide-react"
import { HexColorPicker } from "react-colorful"

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

const defaultColors = [
  "#FF6900",
  "#FCB900",
  "#7BDCB5",
  "#00D084",
  "#8ED1FC",
  "#0693E3",
  "#ABB8C3",
  "#EB144C",
]

export const ColorPicker = ({
  color,
  onChange,
}: {
  color: string
  onChange: (color: string) => void
}) => (
  <div className="flex items-center gap-4">
    <Popover>
      <PopoverTrigger>
        <Color color={color} wrapper />
      </PopoverTrigger>
      <PopoverContent className="p-0 h-14 flex items-center justify-center px-4">
        <div className="flex gap-2  items-center w-full p-0">
          {defaultColors.map((color) => (
            <Color
              color={color}
              onClick={() => {
                onChange(color)
              }}
            />
          ))}
          <div>
            <Popover>
              <PopoverTrigger className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 rounded-md border p-1">
                  <Pipette className="text-lg" />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <HexColorPicker onChange={onChange} color={color} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
)

export const Color = ({
  color,
  onClick,
  wrapper,
}: {
  wrapper?: boolean
  color: string
  onClick?: () => void
}) => {
  return wrapper ? (
    <div
      className="flex items-center justify-center w-8 h-8 rounded-md border"
      onClick={onClick}
    >
      <div className="w-4 h-4 rounded-full" style={{ background: color }} />
    </div>
  ) : (
    <div
      className="w-5 h-5 rounded-full hover:scale-110"
      style={{ background: color }}
      onClick={onClick}
    />
  )
}
