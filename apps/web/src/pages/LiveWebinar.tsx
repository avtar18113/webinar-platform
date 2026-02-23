import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../api/http";

export default function LiveWebinar() {
  const { id } = useParams();
  const [webinar, setWebinar] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await http.get(`/api/webinars/${id}/lobby`);
        setWebinar(res.data.webinar);
      } catch (err) {
        console.error("Live load failed", err);
      }
    }
    load();
  }, [id]);

  if (!webinar) return <div>Loading...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>{webinar.title}</h1>

      <iframe
        width="100%"
        height="500"
        src={`https://www.youtube.com/embed/${webinar.youtubeVideoId}`}
        title="Webinar"
        allowFullScreen
      />
    </div>
  );
}