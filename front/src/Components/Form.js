import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  position: relative;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: max-content;
  padding: 1rem;
  border: ${({ theme }) => theme.color.border} 1px solid;
  border-radius: 5px;

  > input {
    padding: 0.5rem;
    outline: none;
    background-color: ${({ theme }) => theme.color.card.background};
    border: 1px solid ${({ theme }) => theme.color.card.shadow};
    margin: 0.5rem;
    color: ${({ theme }) => theme.color.text};
  }
`;
