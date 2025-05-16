import { useState, useEffect } from "react";
import GenresContainer from "./GenresContainer";
import { useQuery } from "@tanstack/react-query";
import {
  fetchTrackGenres,
  uploadTrackFile,
  deleteTrackFile,
} from "../utils/http.js";

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
  const [audioFile, setAudioFile] = useState(null);
  const [hasExistingAudio, setHasExistingAudio] = useState(
    !!inputData?.audioFile
  );

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
        newErrors.coverImage =
          "Image URL is not valid or doesn't return an image";
      }

      setErrors(newErrors);
      setIsFormValid(
        Object.keys(newErrors).length === 0 && selectedGenres.length > 0
      );
    };

    validate();
  }, [formFields, selectedGenres]);

  async function handleDeleteAudio() {
    //await deleteTrackFile(trackOldData);
    setHasExistingAudio(false);
  }

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

  function handleAudioChange(e) {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  }

  async function handleSubmit(event) {
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
    if (audioFile) {
      trackData.file = audioFile;
    }

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

  const renderInput = (label, name) => (
    <p className="flex flex-col my-3">
      <label htmlFor={name}>{label}</label>
      <input
        className={`bg-slate-200 border px-3 py-2 rounded ${
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
        <small
          data-testid={`error-${name}`}
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
    <form
      id="track-form"
      onSubmit={handleSubmit}
      data-testid="track-form"
      className="max-w-[1000px]"
    >
      <div className="flex gap-4 justify-between">
        <div>
          <div className="flex flex-wrap my-3 gap-4">
            {hasExistingAudio ? (
              <>
                <audio
                  controls
                  src={`http://localhost:8000/api/files/${inputData?.audioFile}`}
                ></audio>
                <button
                  type="button"
                  className="mt-2 bg-red-900 text-white px-3 py-1 rounded"
                  onClick={handleDeleteAudio}
                >
                  Delete Existing Audio
                </button>
              </>
            ) : (
              <>
                <label htmlFor="audio">Audio File (optional)</label>
                <input
                  data-testid={`upload-track-${trackOldData?.id}`}
                  type="file"
                  id="audio"
                  name="audio"
                  accept="audio/*"
                  onChange={handleAudioChange}
                />
              </>
            )}
          </div>

          {renderInput("Title", "title")}
          {renderInput("Album", "album")}
          {renderInput("Artist", "artist")}
          {renderInput("Cover Image", "coverImage")}
        </div>
        {formFields.coverImage ? (
          <div>
            <img src={formFields.coverImage} alt="track image" />
          </div>
        ) : (
          <div>
            <img src="/music-track-placeholder.webp" alt="track image" />
          </div>
        )}
      </div>
      {selectedGenres && (
        <div className="bg-slate-500 flex flex-wrap gap-2 mt-6 rounded-md p-2">
          <GenresContainer
            genres={selectedGenres}
            areSelected={true}
            onChangeSelectedGenres={handleSelectGenre}
          />
        </div>
      )}
      <div className="max-w-[1000px] my-2">
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
