import { useState, useEffect } from "react";
import GenresContainer from "./GenresContainer";
import { useQuery } from "@tanstack/react-query";
import { fetchTrackGenres } from "../utils/http.js";
import Error from "./Error.jsx";

const TrackForm = ({ inputData, onSubmit, trackOldData, buttons }) => {
  const [formFields, setFormFields] = useState({
    title: inputData?.title ?? "",
    album: inputData?.album ?? "",
    artist: inputData?.artist ?? "",
    coverImage: inputData?.coverImage ?? "",
  });
  const [touchedFields, setTouchedFields] = useState({});
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState(inputData?.genres || []);
  const [allGenres, setAllGenres] = useState([]);

  const { data, isPending, isError, error } = useQuery({
    queryFn: fetchTrackGenres,
    queryKey: ["track-genres"],
  });

  useEffect(() => {
    if (data && selectedGenres) {
      const filteredGenres = data.filter(
        (genreName) => !selectedGenres.includes(genreName)
      );
      setAllGenres(filteredGenres);
    }
  }, [data, selectedGenres]);

  useEffect(() => {
    const validate = async () => {
      const newErrors = {};
      if (!formFields.title.trim()) newErrors.title = "Title is required";
      if (!formFields.album.trim()) newErrors.album = "Album is required";
      if (!formFields.artist.trim()) newErrors.artist = "Artist is required";
  
      const isValidImg = await validateImageUrl(formFields.coverImage);
      if (!formFields.coverImage.trim()) {
        newErrors.coverImage = "Cover image URL is required";
      } else if (!isValidImg) {
        newErrors.coverImage = "Image URL is not valid or doesn't return an image";
      }
  
      setErrors(newErrors);
      setIsFormValid(Object.keys(newErrors).length === 0 && selectedGenres.length > 0);
    };
  
    validate();
  }, [formFields, selectedGenres]);
  

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectGenre(genre) {
    if (!selectedGenres.includes(genre)) {
      setSelectedGenres((prevState) => [...prevState, genre]);
    } else {
      setSelectedGenres((prevState) => prevState.filter((g) => g !== genre));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const trackData = Object.fromEntries(formData);

    trackData.id = trackOldData?.id || Date.now().toString();
    trackData.slug =
      trackOldData?.slug ||
      trackData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    trackData.createdAt = trackOldData?.createdAt || new Date().toISOString();
    trackData.updatedAt = new Date().toISOString();
    trackData.genres = JSON.parse(trackData.genres);

    onSubmit({ ...trackData });
  }

  function validateImageUrl(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  const renderInput = (label, name, dataTestId) => (
    <p className="flex flex-col my-3">
      <label htmlFor={name}>{label}</label>
      <input
        className={`bg-slate-200 w-[50%] border px-2 py-1 rounded ${
          touchedFields[name]
            ? errors[name]
              ? "border-red-500"
              : "border-green-500"
            : "border-gray-300"
        }`}
        type="text"
        id={name}
        name={name}
        value={formFields[name]}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />
      {touchedFields[name] && (
        <small data-testid={`error-${fieldname}`}
          className={`text-sm ${
            errors[name] ? "text-red-500" : "text-green-600"
          }`}
        >
          {errors[name] ? errors[name] : "Looks good!"}
        </small>
      )}
    </p>
  );

  return (
    <form id="track-form" onSubmit={handleSubmit} data-testid="track-form">
      {renderInput("Title", "title")}
      {renderInput("Album", "album")}
      {renderInput("Artist", "artist")}
      {renderInput("Cover Image", "coverImage")}

      {selectedGenres && (
        <div className="selected-genres bg-slate-500">
          <GenresContainer
            genres={selectedGenres}
            areSelected={true}
            onChangeSelectedGenres={handleSelectGenre}
          />
        </div>
      )}
      <div className="max-w-[1000px]">
        {isPending && <p>Loading genres...</p>}
        {isError && (
          <Error title="Failed to load genres" message="Please try again" />
        )}
        {allGenres && (
          <GenresContainer
            genres={allGenres}
            onChangeSelectedGenres={handleSelectGenre}
          />
        )}
        <input
          type="hidden"
          name="genres"
          data-testid="genre-selector"
          value={JSON.stringify(selectedGenres)}
        />
      </div>
      {buttons}
    </form>
  );
};

export default TrackForm;
