import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { useParams } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

const SingleEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  const registerEvent = async () => {
    try {
      const response = await axiosInstance.put(`/event/${id}`);
      if (response.data.success) {
        toast.success(response.data.message || "Successfully registered!");
        setIsRegistered(true);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to register for the event"
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchEvent = async () => {
      try {
        const response = await axiosInstance.get(`/event/${id}`);
        if (response.data.success) {
          setEvent(response.data.event);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch event details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, isRegistered]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  if (!event) {
    return (
      <div className="text-center mt-10 text-red-500">Event not found</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="overflow-hidden">
        <img
          src={"/vite.svg"}
          alt={event.title}
          className="w-full h-64 object-cover"
        />
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{event.category}</Badge>
            <span className="text-sm text-muted-foreground">
              {formatDate(event.date)}
            </span>
          </div>
          <CardTitle className="text-2xl mt-2">{event.title}</CardTitle>
          <p className="text-muted-foreground text-sm">{event.location}</p>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent>
          <p className="text-base leading-relaxed mb-4">{event.description}</p>
          <Button onClick={registerEvent} disabled={isRegistered}>
            {isRegistered ? "Registered" : "Register Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleEvent;
