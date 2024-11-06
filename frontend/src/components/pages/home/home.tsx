import Movies from "../../contents/movies";
import Header from "../../partials/header/header";

const HomePage = () => {
  return(
    <>
      <div className="md:h-screen h-full bg-slate-800 pt-20">
        <Header />
        <div className="mt-9 mb-10">
          <h1 className="text-center opacity-0 xl:opacity-100 xl:mt-0 mt-8 text-3xl font-bold text-white">Bibloteca de Filmes</h1>
        </div>
        <div className="p-5">
          <Movies />
        </div>
      </div>
    </>
  )
}

export default HomePage;