"use client";

import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";

interface Event {
  name: string;
  time: string;
  location: string;
  description?: string;
}

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {
  return (
    <section className="py-24 bg-[#faf9f6]">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif text-gray-900 mb-4">Wedding Events</h2>
          <div className="h-[1px] w-20 bg-gray-300 mx-auto" />
        </motion.div>

        <div className="space-y-12">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex flex-col md:flex-row bg-white p-8 rounded-2xl shadow-sm border border-gray-100 items-center gap-8"
            >
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-serif text-gray-800 mb-2">{event.name}</h3>
                {event.description && (
                  <p className="text-gray-600 mb-4 font-light leading-relaxed">
                    {event.description}
                  </p>
                )}
                <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-500 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-32 flex justify-center">
                <button className="text-xs uppercase tracking-[0.2em] font-medium text-gray-400 border-b border-gray-200 pb-1 hover:text-gray-900 hover:border-gray-900 transition-all">
                  Get Directions
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
