'use client';

import { Info } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SizeAnalysisResult } from '@/mocks/size';

interface SimilarUserTableProps {
  similarUsersSample: SizeAnalysisResult['similarUsersSample'];
}

// 고객과 체형이 유사한 다른 고객들의 사이즈 정보 테이블 컴포넌트

export function SimilarUserTable({
  similarUsersSample,
}: SimilarUserTableProps) {
  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="mb-5 flex items-start gap-2 rounded-md bg-gray-50 p-3 text-xs text-gray-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
        <span>
          고객님과 체형(키 ±5cm, 몸무게 ±5kg)이 유사한 고객들이
          <br />
          실제 구매하고 만족한 사이즈 정보입니다.
        </span>
      </div>
      <div className="mb-12 overflow-hidden border border-gray-200">
        <Table className="text-lg leading-5 font-normal not-italic">
          <TableHeader className="bg-gray-50">
            <TableRow className="h-16">
              <TableHead className="w-1/3 text-center">구매 사이즈</TableHead>
              <TableHead className="w-1/3 text-center">키</TableHead>
              <TableHead className="w-1/3 text-center">몸무게</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {similarUsersSample.length > 0 ? (
              similarUsersSample.map((user, idx) => (
                <TableRow key={`${user.id}-${idx}`} className="h-16">
                  <TableCell className="text-ongil-teal text-center">
                    {user.size}
                  </TableCell>
                  <TableCell className="text-center">{user.height}cm</TableCell>
                  <TableCell className="text-center">{user.weight}kg</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center text-sm text-gray-500"
                >
                  데이터가 충분하지 않습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
