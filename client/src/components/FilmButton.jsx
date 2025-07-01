import { Link } from "react-router-dom";

const FilmButton = (props) => {
  return (
    <>
      <Link key={props.data._id} to={`/films/${props.data.id}`}>
        <div>{props.data.title}</div>
      </Link>
    </>
  );
};

export default FilmButton;
