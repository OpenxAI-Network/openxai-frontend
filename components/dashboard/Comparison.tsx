'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import "chart.js/auto";

// Simplified to only contain the chart comparison
const CloudComparisonSection = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined' || !chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Import Chart.js dynamically to ensure it only runs on client
    import('chart.js').then(({ Chart }) => {
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['OpenXAI', 'AWS', 'Google Cloud', 'Microsoft Azure', 'Hugging Face'],
          datasets: [
            {
              label: 'Cost & Energy Consumption',
              data: [3, 7.4, 8.1, 8.6, 6.4],
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              barPercentage: 0.7,
              categoryPercentage: 0.8
            },
            {
              label: 'Content Censorship & Restrictions',
              data: [0.5, 9.5, 9.2, 9.6, 6.9],
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              barPercentage: 0.7,
              categoryPercentage: 0.8
            },
            {
              label: 'Model Ownership, Data Control & Privacy',
              data: [10, 3.2, 3.5, 3.6, 5.4],
              backgroundColor: 'rgba(255, 206, 86, 0.7)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
              barPercentage: 0.7,
              categoryPercentage: 0.8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 10,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#6A6A6A'
              },
              border: {
                display: false
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                display: false
              },
              border: {
                display: false
              }
            }
          },
          layout: {
            padding: {
              bottom: 80
            }
          },
          backgroundColor: '#1F2021'
        }
      });
      
      // Return cleanup function
      return () => chart.destroy();
    }).catch(error => {
      console.error('Chart error:', error);
    });
  }, []);

  return (
    <div className="rounded-lg border border-[#454545] bg-[#1F2021]/50 p-6">
      <h2 className="mb-6 text-2xl font-bold">
        <span className="bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">
          Cost, Censorship & Privacy Comparison
        </span>
      </h2>
      
      <div className="mt-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Composition of following models</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'deepseek', display: 'Deepseek' },
              { name: 'llama', display: 'Llama' },
              { name: 'mistral', display: 'Mistral' },
              { name: 'qwen', display: 'Qwen' }
            ].map((model) => (
              <div key={model.name} className="flex items-center">
                <Image 
                  src={`https://studio.openxai.org/images/models/${model.name}.png`}
                  alt={model.name}
                  width={32}
                  height={32}
                  className="mr-2 rounded-md bg-[#1a1a1a] p-1"
                />
                <span className="text-sm text-white">{model.display}</span>
              </div>
            ))}
          </div>
      </div>
      
      <div className="relative mt-4 h-[350px] w-full">
        <canvas ref={chartRef}></canvas>
        
        <div className="absolute bottom-[15px] flex w-full justify-between px-8">
          {[
            { name: 'openxai', display: 'OpenXAI' },
            { name: 'aws', display: 'AWS' },
            { name: 'googlecloud', display: 'Google Cloud' },
            { name: 'azure', display: 'Microsoft Azure' },
            { name: 'huggingface', display: 'Hugging Face' }
          ].map((company) => (
            <div key={company.name} className="flex w-1/5 flex-col items-center">
              <div className="flex h-[40px] items-center justify-center">
                <Image 
                  src={`/providers/${company.name}.png`}
                  alt={company.display}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="mt-2 flex h-[10px] items-center justify-center">
                <span className="text-center text-xs text-gray-400">{company.display}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-center gap-4">
        <div className="flex items-center">
          <div className="mr-2 size-3 rounded-sm bg-[rgba(255,99,132,0.7)]"></div>
          <span className="text-xs text-gray-400">Cost & Energy</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 size-3 rounded-sm bg-[rgba(54,162,235,0.7)]"></div>
          <span className="text-xs text-gray-400">Content Censorship</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 size-3 rounded-sm bg-[rgba(255,206,86,0.7)]"></div>
          <span className="text-xs text-gray-400">Model Ownership & Privacy</span>
        </div>
      </div>
    </div>
  );
};

export default CloudComparisonSection; 