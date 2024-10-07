import { Loader } from '../Loader';
import React, { useEffect, useState } from 'react';
import { Person } from '../../types';
import { getPeople } from '../../api';
import cs from 'classnames';
import { Link, useLocation, useNavigate } from 'react-router-dom';

enum Error {
  NoError = 'No Error',
  NoPeople = 'No People',
  SomethingWentWrong = 'Something Went Wrong',
}

const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<Error>(Error.NoError);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    getPeople()
      .then(data => {
        if (!data.length) {
          setError(Error.NoPeople);
        } else {
          setError(Error.NoError);
        }

        setPeople(data);
      })
      .catch(() => {
        setError(Error.SomethingWentWrong);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const findPerson = (selectedPersonName: string | null) => {
    return people.find(p => p.name === selectedPersonName);
  };

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="box table-container">
          {loading && <Loader />}

          {error === Error.SomethingWentWrong && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          )}

          {error === Error.NoPeople && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}

          {error === Error.NoError && !loading && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {people.map((person: Person) => (
                  <tr
                    key={person.name}
                    className={cs('', {
                      'has-background-warning':
                        location.pathname.slice(8) === person.slug,
                    })}
                    data-cy="person"
                  >
                    <td>
                      <Link
                        className={cs('', {
                          'has-text-danger': person.sex === 'f',
                        })}
                        to={`/people/${person.slug}`}
                        onClick={event => {
                          event.preventDefault();

                          navigate(`/people/${person.slug}`);
                        }}
                      >
                        {person.name}
                      </Link>
                    </td>

                    <td>{person.sex}</td>
                    <td>{person.born}</td>
                    <td>{person.died}</td>
                    <td>
                      {!!person.motherName ? (
                        !!findPerson(person.motherName) ? (
                          <Link
                            className="has-text-danger"
                            to={`/people/${findPerson(person.motherName)?.slug}`}
                            onClick={event => {
                              event.preventDefault();

                              if (person.motherName) {
                                navigate(
                                  `/people/${findPerson(person.motherName)?.slug}`,
                                );
                              }
                            }}
                          >
                            {person.motherName}
                          </Link>
                        ) : (
                          person.motherName
                        )
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {!!person.fatherName ? (
                        !!findPerson(person.fatherName) ? (
                          <Link
                            to={`/people/${findPerson(person.fatherName)?.slug}`}
                            onClick={event => {
                              event.preventDefault();

                              if (person.fatherName) {
                                navigate(
                                  `/people/${findPerson(person.fatherName)?.slug}`,
                                );
                              }
                            }}
                          >
                            {person.fatherName}
                          </Link>
                        ) : (
                          person.fatherName
                        )
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default PeoplePage;
