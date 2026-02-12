import "../index.css";

function AboutPage() {
    return (
        <div className="flex flex-col w-[75%] gap-6 items-center">
            <h1 className="text-center text-5xl md:text-6xl lg:text-7xl font-black tracking-[0.15em]">Re<span className="font-normal">ad</span> La<span className="font-normal">ter</span></h1>
            <p className="text-center text-xl md:text-2xl lg:text-2.5xl font-medium tracking-widest">あとで読む</p>
            <div className="w-[75%] h-0.5 bg-black my-5"></div>
            <p className="text-center text-sm md:text-base lg:text-xl leading-8 lg:leading-10 font-medium">このアプリは、「いいな！」「もう一度読みたい！」「またあとで読も！」と思ったWebサイトを、タブを増やすことなく保存しておくことができます。</p>
        </div>
    );
}
export default AboutPage;