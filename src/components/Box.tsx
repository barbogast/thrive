import styled from 'styled-components'

type Props = {
  readonly color: string
}

const Box = styled.span<Props>`
  background-color: ${(props) => props.color};
  width: 10px;
  height: 10px;
  display: inline-block;
`

export default Box
