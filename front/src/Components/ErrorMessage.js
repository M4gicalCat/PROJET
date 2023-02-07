import styled from 'styled-components';

const Container = styled.div`
  text-align: justify;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.error.border};
  border-radius: 12px;
  margin: 1rem;
  background-color: ${({ theme }) => theme.color.error.background};
  color: ${({ theme }) => theme.color.error.text};
`;

export const ErrorMessage = ({ message }) => {
  return message.length > 0 ? <Container>{message}</Container> : null;
};
