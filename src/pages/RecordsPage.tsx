import { useState, useEffect, useCallback } from 'react';
import { fetchDeclarations } from '../services/api';
import type { Declaration } from '../types';
import StatusPill from '../components/StatusPill';
import { FiRefreshCw, FiAlertCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const RecordsPage = () => {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const loadDeclarations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchDeclarations(pagination.page, pagination.limit);
      setDeclarations(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total
      }));
      setError(null);
    } catch (err) {
      setError('Failed to load declarations');
      console.error('Error loading declarations:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    loadDeclarations();
  }, [loadDeclarations]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPagination({
        ...pagination,
        page: newPage
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Declaration Records</h2>
          <button 
            onClick={loadDeclarations}
            className="px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center cursor-pointer"
          >
            <FiRefreshCw className="h-4 w-4" />
          </button>
        </div>
        
        {error && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-200">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-700"></div>
          </div>
        ) : declarations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No declarations found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Has Symptoms</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact with Covid</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {declarations.map((declaration) => (
                    <tr key={declaration._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {declaration.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {declaration.temperature}°C
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusPill 
                          value={declaration.hasSymptoms}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusPill 
                          value={declaration.contactWithCovid}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(declaration.submissionDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                          pagination.page === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-500 hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <FiChevronLeft className="h-5 w-5" />
                      </button>
                                          
                    {[...Array(totalPages)].map((_, i) => {
                        if (
                          i === 0 || 
                          i === totalPages - 1 || 
                          (i >= pagination.page - 2 && i <= pagination.page)
                        ) {
                          return (
                            <button
                              key={i}
                              onClick={() => handlePageChange(i + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pagination.page === i + 1
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer'
                              }`}
                            >
                              {i + 1}
                            </button>
                          )
                        } else if (
                          i === 1 && pagination.page > 3 || 
                          i === totalPages - 2 && pagination.page < totalPages - 2
                        ) {
                          return (
                            <span
                              key={i}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          )
                        }
                        return null
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                          pagination.page === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-500 hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <FiChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
                              
              <div className="flex items-center justify-between w-full sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      pagination.page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <FiChevronLeft className="h-5 w-5 mr-1" />
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">
                    Page {pagination.page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      pagination.page === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    Next
                    <FiChevronRight className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecordsPage;