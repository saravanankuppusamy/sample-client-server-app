import { Link } from "react-router-dom";

const PlanetButton = (props) => {
  return (
    <>
      <Link key={props.data._id} to={`/planets/${props.data.id}`}>
        <div>{props.data.name}</div>
      </Link>
    </>
  );
};

export default PlanetButton;
