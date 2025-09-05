// <!-- 
// ___________________________________________________________________________

//                             copyright © 2024 Jetson Black
//                             x.com/jetsonbb
//                             http://jetsonblack.com/

//                             just a simple page for myself!
// ___________________________________________________________________________
// -->
import GradientBG from "./components/GradientBG.jsx";
import SplitText from "./components/SplitText";
import PersistentTodo from "./components/PersistentTodo.jsx";

export default function App() {
  return (
    <div className="test-length">
      <GradientBG
        blobCount={12}
        haloSize={160}
        ringSize={22}
        scrollPosFactor={0.05}
        scrollVelFactor={0.03}
        scrollVelDecay={0.88}
      />

      <div className="hero-text-container">
        <SplitText
          text="Hello I'm Jetson!"
          className="hero-text"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <PersistentTodo/>
      </div>
    </div>
  );
}
