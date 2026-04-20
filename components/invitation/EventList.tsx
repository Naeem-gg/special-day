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
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              className="flex flex-col md:flex-row bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl border border-gray-100 items-center gap-10 transition-shadow group"
            >
              <div className="flex-1 text-center md:text-left">
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary mb-3 block">Event {index + 1}</span>
                <h3 className="text-3xl font-serif text-gray-900 mb-3">{event.name}</h3>
                {event.description && (
                  <p className="text-gray-600 mb-6 font-light leading-relaxed max-w-lg">
                    {event.description}
                  </p>
                )}
                <div className="flex flex-col md:flex-row gap-6 text-sm text-gray-400 justify-center md:justify-start">
                  <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <button className="px-8 py-3 rounded-full border border-gray-200 text-xs uppercase tracking-[0.2em] font-bold text-gray-400 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-sm">
                  View Map
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
