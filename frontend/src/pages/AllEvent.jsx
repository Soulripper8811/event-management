import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import { useNavigate } from "react-router";

const AllEvent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/event");
        if (response.data.success) {
          setEvents(response.data.events);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message || "Failed to fetch events");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  console.log(events);
  if (loading) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Events</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card
            key={event.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={"/vite.svg"}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>
                {formatDate(new Date(event.date))} • {event.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className={"cursor-pointer"}
                onClick={() => navigate(`/event/${event._id}`)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllEvent;
