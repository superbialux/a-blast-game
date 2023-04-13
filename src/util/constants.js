import BlueTile from "../assets/blue.png";
import GreenTile from "../assets/green.png";
import PurpleTile from "../assets/purple.png";
import YellowTile from "../assets/yellow.png";
import RedTile from "../assets/red.png";

const types = ["blue", "green", "purple", "yellow", "red"];

const typeToImgMapping = {
  blue: BlueTile,
  green: GreenTile,
  purple: PurpleTile,
  yellow: YellowTile,
  red: RedTile,
};

export { types, typeToImgMapping };
