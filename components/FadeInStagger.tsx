"use client";

import { motion } from "framer-motion";
import React from "react";

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeInStagger({ 
  children, 
  className = "",
  delay = 0 
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
            delayChildren: delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
