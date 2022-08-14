import Carousel from "./components/Carousel";
import "./style.css";

function App() {
  const slideItem = [
    {
      id: 1,
      title: "Slide One",
      background: "#cf4040",
      index: 0,
    },
    // {
    //   id: 2,
    //   title: "Slide Two",
    //   background: "#974dc2",
    //   index: 1,
    // },
    // {
    //   id: 3,
    //   title: "Slide Three",
    //   background: "#4986e0",
    //   index: 2,
    // },
  ];

  return (
    <div>
      <Carousel infinite timer={2000}>
        {slideItem.map((s) => (
          <div
            key={s.id}
            style={{
              width: "100%",
              height: "100%",
              background: s.background,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              color: "#fff",
            }}
          >
            <span>{s.title}</span>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default App;
