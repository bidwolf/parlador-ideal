import React, { useState } from 'react'
import { TextInputProps, View } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { defaultTheme } from '../../theme'
import { Container, IconContainer, InputText } from './styles'
export type InputProps = TextInputProps & {
  icon: React.ComponentProps<typeof Feather>['name']
  value?: string
}
export function InputForm({ icon, value, ...rest }: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  function handleInputFocus() {
    setIsFocused(true)
  }

  function handleInputBlur() {
    setIsFocused(false)
    setIsFilled(!!value)
  }
  return (
    <Container>
      <IconContainer isFocused={isFocused}>
        <Feather
          name={icon}
          size={32}
          color={
            isFocused || isFilled
              ? defaultTheme.colors.blue300
              : defaultTheme.colors.blue500
          }
        />
      </IconContainer>
      <InputText
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        isFocused={isFocused}
        placeholderTextColor={defaultTheme.colors.text.secondary}
        value={value}
        {...rest}
      />
    </Container>
  )
}