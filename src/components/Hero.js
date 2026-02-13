export default function Hero() {
    return (<section className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('/series.jpg')" }}>
        <div className="absolute inset-0 bg-black/60 flex items-center">
          <div className="px-6 max-w-xl text-white">
            <h2 className="text-4xl font-bold mb-4">
              باب الحارة
            </h2>
            <p className="text-gray-300 mb-6">
              مسلسل درامي سوري يحكي قصص الحياة الشامية
            </p>
            <button className="bg-red-600 px-6 py-3 rounded hover:bg-red-700">
              عرض التفاصيل
            </button>
          </div>
        </div>
      </section>);
}
