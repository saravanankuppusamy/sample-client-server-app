import { Link } from "react-router-dom";

const CharacterButton = (props) => {
  return (
    <>
      <Link key={props.data._id} to={`/characters/${props.data.id}`}>
        <div>{props.data.name}</div>
      </Link>
    </>
  );
};

export default CharacterButton;
