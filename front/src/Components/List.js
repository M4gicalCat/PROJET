import styled from "styled-components";

export const List = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  
  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid ${({theme}) => theme.color.border};
    &:hover {
      background-color: ${({theme}) => theme.color.card.background};
    }
    > div {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 5rem;
      & * {
        width: 1rem;
        height: 1rem;
      }
    }
  }
`;