import { CardContent } from "@material-ui/core";
import React from "react";

function ProductCard() {
  return (
    <CardContent>
      <img src="https://picsum.photos/200/300?random=1" />
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo..
      </p>
    </CardContent>
  );
}

export default ProductCard;
