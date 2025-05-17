import { Outlet } from "react-router";
import Nav from "./nav";
import DoubleChevron from "../doubleChevron";

export default function MdxLayout() {
  return (
    <>
      <main>
        <Nav />
        <div className="p-1 prose dark:prose-invert max-w-5xl">
          <Outlet />
        </div>
      </main>
      <div className="text-center pt-8">
        <a href="#top">
          <DoubleChevron />
          <span>&nbsp;Top&nbsp;</span>
          <DoubleChevron />
        </a>
      </div>
    </>
  );
}
