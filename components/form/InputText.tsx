export default function InputText({ label, id, value, onChange }: any) {
  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm font-light leading-6 text-white"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          type="text"
          name={id}
          id={id}
          value={value}
          onChange={onChange}
          //className="block w-full rounded-md border-0 py-1.5 px-3 font-light shadow-sm ring-1 ring-inset ring-black/15 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-black/15 sm:text-sm sm:leading-6 outline-black/15"

          className="block w-full rounded-md border-0 py-1.5 px-3 font-light shadow-sm ring-1 ring-inset ring-primary-light placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary-main sm:text-sm sm:leading-6 outline-primary-main"
        />
      </div>
    </>
  );
}
