import styled from 'styled-components';

export const Input = styled.input`
  padding: 0.5rem;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  background-color: transparent;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: 1rem;
  font-size: 1.1rem;

  &:focus {
    outline: none;
  }
`;
