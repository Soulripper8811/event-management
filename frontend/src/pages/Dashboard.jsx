import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserEvents = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/event/user");
      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load your events"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">Loading...</div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-10">
        You haven’t created any events yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Created Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card
            key={event._id}
            onClick={() => navigate(`/event/${event._id}`)}
            className={"cursor-pointer"}
          >
            <CardHeader>
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatDate(event.date)}
              </p>
              <p className="text-sm text-muted-foreground">{event.location}</p>
            </CardHeader>
            <Separator />
            <CardContent>
              <p className="text-sm">{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
