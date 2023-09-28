import { Link } from "react-router-dom";

const Navbar = () => {
  const padding = {
    paddingRight: 5,
  };

  return (
    <div>
      <Link style={padding} to="/">
        Home
      </Link>
      <Link style={padding} to="/create">
        Add New Job
      </Link>
    </div>
  );
};

export default Navbar;
